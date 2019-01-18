# Layout

## Take away

* Qt provide several builtin layout management classes: `QBoxLayout`, `QButtonGroup`, `QGridLayout`, .etc..
* Frequently used builtin layout managers: `QHBoxLayout`, `QVBoxLayout`, `QGridLayout`, `QFormLayout`. They inherit from `QLayout`.
* Layout managers can be nested inside each other.
* Layout can be set using `QWidget::setLayout()`.
* Size hint: the preferred size of the widget, layouts will try to keep it as close to this as possible.
* Size policy: how the size may change when the preferred size cannot be used (stretch or shrink).
* Size constraint: maximum and minimum size.

## Adding Widgets to a Layout

The process occurs when adding widgets to a layout:

> 1. All the widgets will initially be allocated an amount of space in accordance with their `QWidget::sizePolicy()` and `QWidget::sizeHint()`.
> 2. If any of the widgets have stretch factors set, with a value greater than zero, then they are allocated space in proportion to their stretch factor (explained below).
> 3. If any of thewidgets have stretch factors set to zero they will only get more space if no other widgets want the space. Of these, space is allocated to widgets with an [Expanding](http://doc.qt.io/qt-5/qsizepolicy.html#Policy-enum) size policy first.
> 4. Any widgets that are allocated less space than their minimum size (or minimum size hint if no minimum size is specified) are allocated this minimum size they require. (Widgets don't have to have a minimum size or minimum size hint in which case the stretch factor is their determinig factor.)
> 5. Any widgets that are allocated more space than their maximum size are allocated the maximum size space they require. (Widgets do not have to have a maximum size in which case the stretch factor is their determining factor).
> 5. Any widgets that are allocated more space than their maximum size are allocated the maximum size space they require. (Widgets do not have to have a maximum size in which case the stretch factor is their determining factor).

## Stretch Factors

	Stretch factors are used to set the space that a widget take over in proportion to its siblings.

## Custom Widgets in Layouts

* Reimplement `QWidget::sizeHint()` to return the preferred sinze of the widget.
* Reimplement `QWidget::minimumSizeHint()` to return the smallest size the widget can have.
* Call `QWidget::setSizePolicy()` to specify the spacec requiremenets of the widget.

## Issues when using rich text in a label widget: [link](http://doc.qt.io/qt-5/layout.html#layout-issues)

## Custom Layout

Following properties and methods have to define:

* A data struktur to store the items handled by the layout. Each item is a `QLayoutItem`.
* `addItem()` to add items to the layout.
* `setGeometry()` to perform the layout.
* `sizeHint()` to tell the preferred size of the layout.
* `itemAt()` to iterate over the layout.
* `takeAt()` to remove items from the layout.
* `minimumSize()`

[Example](http://doc.qt.io/qt-5/layout.html#the-header-file-card-op-op-h)
