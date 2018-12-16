# Concurrency

## Two ways to manage concurrent updates on resource
    * __Pessimistic concurrency control__, implies that the service locks the resource so that a client cannot updated it. While the resource is locked, no other client can modify it.
    * __Optimistic concurrency control__, implies that a client first obtains a token for the update operation. Once the token is received, it allows the client to perform the update. However, the changes will only apply if the token is still valid.

#### Optimistic Concurrency Control:

    * Using `If-Unmodified-Since` and `If-Matched` HTTP headers on the client's request.

    * Service responds with `Last-Modified` and `ETag` headers.

    * Pros:
        - Transactions are executed more efficiently.
        - Data content is relatively safe.
        - Throughput is much higher.

    * Cons:

        - There is a risk of data interference among concurrent transactions since it transactions conflict may occur during execution. In this case, data is no longer correct.

        - Database may have some hidden errors with inconsistent data; even conflict check is performed at the end of transactions.

        - Transactions may be in deadlock that causes the system to hang.


#### Pessimistic Concurrency Control:
        
        * The pessimistic concurrency control delays the transactions if they conflict with other transactions at some time in the future by locking or a time-stamping technique.

        * Pros:
            - Guarantee that all transactions can be executed correctly.
            - Data is properly consistent by either rolling back to the previous state (Abort operation) or new content (Commit operation) when the transaction conflict is cleared.
            - Database is relatively stable and reliable.

        * Cons:
            - Transactions are slow due to the delay by locking or time-stamping event.
            - Runtime is longer. Transaction latency increases significantly.
            - Throughput or the amount of work (e.g. read/write, update, rollback operations, etc.) is reduced.



## References:

        1. [REST Best Practices: Managing Concurrent Updates](https://blog.4psa.com/rest-best-practices-managing-concurrent-updates/)
    2. 
        
