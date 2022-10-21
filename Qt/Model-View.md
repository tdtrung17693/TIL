---
id: 3s47XyMtCmQLrA5yQAVfD6
title: Model-View
---




# Model-View

## Custom models:

### Read-Only Access

* `flags()`
* `data()`
* `headerData()`
* `rowCount()`
* `columnCount()` (This function is already implemented in `QAbstractListModel`

### Editable Models

* `flags()` return flags which include `Qt::ItemIsEditable`
* `setData()`
* `setHeaderData()`

### Resizable Models

* `insertRows()`
* `removeRows()`
* `insertColumns()`
* `removeColumns()`

### Changes to the models

Perform this sequences if there is any changes to the models:

* Emit the `layoutAboutToBeChanged()` signal.
* Update internal data which represents the strucutre of the model.
* Update persistent indexes using `changePersistentindexList()`.
* Emit the `layoutChanged()` signal.

### Lazy population

Only call `rowCount()` when necessary by reimplementin `hasChildren()`

