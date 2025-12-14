import { Extension } from '@tiptap/core'

const TAB_CHAR = '    '
const TabIndent = Extension.create({
  name: 'tabIndent',
  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        return editor.commands.insertContent(TAB_CHAR)
      },
    }
  },
})

export default TabIndent
