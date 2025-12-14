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
import { BulletList, ListItem, OrderedList } from '@tiptap/extension-list'
import { UndoRedo } from '@tiptap/extensions/undo-redo'
import Link from '@tiptap/extension-link'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Dropcursor } from '@tiptap/extensions'
import Image from '@tiptap/extension-image'
import Blockquote from '@tiptap/extension-blockquote'
import Youtube from '@tiptap/extension-youtube'

export const extensions = [
  Document,
  Paragraph,
  Text,
  Bold,
  HardBreak,
  Italic,
  Underline,
  StrikeThrough,
  Code,
  UndoRedo,
  ListItem,
  Blockquote,
  Youtube,
]

export const extraExtensions = [
  Highlight,
  OrderedList,
  Heading,
  BulletList,
  Link,
  HorizontalRule,
  CodeBlockLowlight,
  Dropcursor,
  Image,
]

export const callbackUrl: string =
  import.meta.env.VITE_APP_CALLBACK_URL || 'http://localhost:3000/auth/callback'
