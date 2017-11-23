const {
  CompositeDisposable
} = require('atom')
const memefy = require('memefy')

module.exports = {
  subscriptions: null,

  activate() {
    this.subscriptions = new CompositeDisposable()

    let providers = [memefy.transformers, memefy.maps]

    providers.forEach((provider) => {
      Object.keys(provider).forEach((key) => {
        this.subscriptions.add(atom.commands.add(
          'atom-workspace',
          `memefy:${key}`,
          () => {
            this.transform(false, memefy[key])
            atom.notifications.addSuccess('Successfully applied \'' + key + '\'')
          }
        ))
      })
    })
  },

  deactivate() {
    this.subscriptions.dispose()
  },

  transform(all, func) {
    const editor = atom.workspace.getActiveTextEditor()
    if (editor) {
      const selection = editor.getSelectedText()
      if (selection === "") {
        editor.setText(func(editor.getText()))
      } else {
        editor.insertText(func(selection))
      }
    }
  }
}
