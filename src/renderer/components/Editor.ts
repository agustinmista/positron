// ----------------------------------------
// The editor component class
// ----------------------------------------

// Adds some functionality to text areas to behave a little like text editors

export default class Editor {

  captureTab = function () {
    if (this.$event.keyCode === 9) {
      this.$event.preventDefault()

      this.$el.setRangeText(
        '  ',
        this.$el.selectionStart,
        this.$el.selectionStart,
        'end'
      );
    }
  }

  adjustHeight = function () {
    this.$el.style.height = 0;
    this.$el.style.height = this.$el.scrollHeight + 'px';
  }

}