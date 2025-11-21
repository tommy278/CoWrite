import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import HardBreak from '@tiptap/extension-hard-break'
import Underline from '@tiptap/extension-underline'
import StrikeThrough from '@tiptap/extension-strike'
import Heading from '@tiptap/extension-heading'
import Code from '@tiptap/extension-code'
import Highlight from '@tiptap/extension-highlight'

export const extensions = [
  Document,
  Paragraph,
  Text,
  Bold,
  HardBreak,
  Italic,
  Underline,
  StrikeThrough,
  Heading,
  Code,
  Highlight,
]

export const callbackUrl: string =
  import.meta.env.VITE_APP_CALLBACK_URL || 'http://localhost:3000/auth/callback'
