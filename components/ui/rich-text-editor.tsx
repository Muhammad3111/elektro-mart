"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link as LinkIcon,
    Undo,
    Redo,
    Heading1,
    Heading2,
    Heading3,
    Quote,
    Code,
} from "lucide-react";
import { Button } from "./button";
import { Toggle } from "./toggle";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function RichTextEditor({
    value,
    onChange,
    placeholder = "Write something...",
    className,
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-primary underline",
                },
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Underline,
        ],
        content: value,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "prose prose-sm dark:prose-invert max-w-none min-h-[200px] p-4 focus:outline-none",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);

        if (url === null) {
            return;
        }

        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
    };

    return (
        <div className={cn("border rounded-lg overflow-hidden", className)}>
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
                {/* Text formatting */}
                <Toggle
                    size="sm"
                    pressed={editor.isActive("bold")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleBold().run()
                    }
                    aria-label="Bold"
                >
                    <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("italic")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleItalic().run()
                    }
                    aria-label="Italic"
                >
                    <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("underline")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleUnderline().run()
                    }
                    aria-label="Underline"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("strike")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleStrike().run()
                    }
                    aria-label="Strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </Toggle>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Headings */}
                <Toggle
                    size="sm"
                    pressed={editor.isActive("heading", { level: 1 })}
                    onPressedChange={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    aria-label="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("heading", { level: 2 })}
                    onPressedChange={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    aria-label="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("heading", { level: 3 })}
                    onPressedChange={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    aria-label="Heading 3"
                >
                    <Heading3 className="h-4 w-4" />
                </Toggle>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Lists */}
                <Toggle
                    size="sm"
                    pressed={editor.isActive("bulletList")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    aria-label="Bullet List"
                >
                    <List className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("orderedList")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    aria-label="Ordered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </Toggle>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Alignment */}
                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: "left" })}
                    onPressedChange={() =>
                        editor.chain().focus().setTextAlign("left").run()
                    }
                    aria-label="Align Left"
                >
                    <AlignLeft className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: "center" })}
                    onPressedChange={() =>
                        editor.chain().focus().setTextAlign("center").run()
                    }
                    aria-label="Align Center"
                >
                    <AlignCenter className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: "right" })}
                    onPressedChange={() =>
                        editor.chain().focus().setTextAlign("right").run()
                    }
                    aria-label="Align Right"
                >
                    <AlignRight className="h-4 w-4" />
                </Toggle>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Other */}
                <Toggle
                    size="sm"
                    pressed={editor.isActive("blockquote")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    aria-label="Quote"
                >
                    <Quote className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("codeBlock")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleCodeBlock().run()
                    }
                    aria-label="Code Block"
                >
                    <Code className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("link")}
                    onPressedChange={setLink}
                    aria-label="Link"
                >
                    <LinkIcon className="h-4 w-4" />
                </Toggle>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Undo/Redo */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="h-8 w-8 p-0"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="h-8 w-8 p-0"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} />
        </div>
    );
}
