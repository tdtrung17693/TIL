# Deploy a K8s cluster on bare-metal server

## Letting iptables see bridged traffic


```shell
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
br_netfilter
EOF

cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables  = 1
EOF
sudo sysctl --system
```

## Check firewall for allowing necessary ports

__Control-plane node(s)__: 6443 (overridable), 2379-2380, 10250, 10251, 10252
__Worker node(s)__: 10250, 30000-32767 (node port range, overridable)

## Install Container Runtime (CRI-compatible) on ALL (Worker and Master) Nodes
Read more: https://kubernetes.io/docs/setup/production-environment/container-runtimes/

Common runtimes:
- Docker
- containerd
- CRI-O

Container runtime is specified at initialization time. If a runtime is not specified,
**kubeadm** will automatically tries to detect an installed container runtime by scanning through a list of well known Unix domain sockets.

### Install containerd

Configure prerequisites:

```shell
cat <<EOF | sudo tee /etc/modules-load.d/containerd.conf
overlay
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# Setup required sysctl params, these persist across reboots.
cat <<EOF | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
net.ipv4.ip_forward                 = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system
```

Installation steps:

1. Install the containerd.io package from the official Docker repositories. Instructions for setting up the Docker repository for your respective Linux distribution and installing the containerd.io package can be found at Install Docker Engine.

2. Configure containerd:

```shell
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
```

3. Restart containerd:

```shell
sudo systemctl restart containerd
```

```shell
sudo yum remove docker \
                  docker-common \
                  docker-selinux \
                  docker-engine
```

4. Setup Cgroup driver:
To use the systemd cgroup driver in `/etc/containerd/config.toml` with **runc**, set

```toml
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```    

```shell
# Restart service
sudo systemctl restart containerd
```

## Install kubectl

Read more: https://kubernetes.io/docs/tasks/tools/install-kubectl/

`curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl`

Make it executable:

`chmod +x ./kubectl`

And pop it into the PATH:

`sudo mv ./kubectl /usr/local/bin/kubectl`


## Install kubelet and kubeadm on ALL (Worker and Master) Nodes
This is straight from https://kubernetes.io/docs/setup/independent/install-kubeadm/

```shell
cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-\$basearch
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
exclude=kubelet kubeadm kubectl
EOF

# Set SELinux in permissive mode (effectively disabling it)
sudo setenforce 0
sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

sudo systemctl enable --now kubelet
```

## Configure Kubernetes Master
On the master node, we want to run:

`sudo kubeadm init --pod-network-cidr=10.244.0.0/16`

The `--pod-network-cidr=10.244.0.0/16` option is a requirement for Flannel - don't change that network address!

You should see a message like the following after `kubeadm` successfully initialized the cluster 

```
...
You can now join any number of machines by running the following on each node as root:

  kubeadm join --token <token> <IP>:6443
...
```

Copy and run the above command on the worker nodes to join them in the cluster.

If you want to join a node at some time later on, you can use the following script:

```shell
# If token has expired, create one
TOKEN=$(kubeadm token create)
HASH=$(openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | \
   openssl dgst -sha256 -hex | sed 's/^.* //')
kubeadm join --token $TOKEN <control-plane-host>:<control-plane-port> --discovery-token-ca-cert-hash sha256:$HASH
```

Replace the control plane host and port with yours.


Start the cluster as a normal user. This part, I realized, was pretty important as it doesn't like to play well when you do it as root.

```shell
sudo cp /etc/kubernetes/admin.conf $HOME/
sudo chown $(id -u):$(id -g) $HOME/admin.conf
export KUBECONFIG=$HOME/admin.conf
```

## Install Flannel for the Pod Network (On Master Node)
We need to install the pod network before the cluster can come up. As such we want to install the latest yaml file that flannel provides. Most installations will use the following:

```shell
kubectl apply -f https://github.com/coreos/flannel/raw/master/Documentation/kube-flannel.yml
```
At this point, give it a minute, and have a look at the status of the cluster. run `kubectl get pods --all-namespaces` and see what it comes back with. If everything shows running, then you're in business! Otherwise, if you notice errors like:

```
NAMESPACE     NAME                                                    READY     STATUS              RESTARTS   AGE
...
kube-system   kube-flannel-ds-knq4b                                   1/2       Error               5          3m
...
```

or

```
NAMESPACE     NAME                                                    READY     STATUS              RESTARTS   AGE
...
kube-system   kube-flannel-ds-knq4b                                   1/2       CrashLoopBackOff    5          5m
...
```

If this is the case, you will need to run the RBAC module as well:

```shell
kubectl create -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel-rbac.yml
```

## Running Workloads on the Master Node
By default, no workloads will run on the master node. You usually want this in a production environment. In my case, since I'm using it for development and testing, I want to allow containers to run on the master node as well. This is done by a process called "tainting" the host.

On the master, we can run the command `kubectl taint nodes --all node-role.kubernetes.io/master-` and allow the master to run workloads as well.

## Generate kubeconfig for kubectl

Authorize using RBAC: https://kubernetes.io/docs/reference/access-authn-authz/rbac/

Create a service account

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
    name: service-user
    namespace: default
```

Create a cluster role

```yaml
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  namespace: default
  name: a-role
rules:
- apiGroups:
  - '*'
  resources:
  - '*'
  verbs:
  - '*'
- nonResourceURLs:
  - '*'
  verbs:
  - '*'
```

This cluster role allows a user to access everything on the cluster, which makes a user a cluster admin. 

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: a-role-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: a-role
subjects:
- kind: ServiceAccount
  name: service-user
  namespace: default
```

Using this script to generate kubeconfig: https://gist.github.com/tdtrung17693/4f4de6a1558ebd9efbbe3ee804a1ad48

