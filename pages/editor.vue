<template>
  <div class="editor">
    <editor-content :editor="editor" />
    <bubble-menu
      v-if="editor"
      :editor="editor"
      :tippy-options="{ placement: 'top', followCursor: 'horizontal' }"
    >
      <template v-if="showLinkInput">
        <input
          v-model="linkHref"
          @keydown.enter.prevent="setLink"
          @keydown.esc.prevent="hideLinkInput"
          type="text"
          placeholder="Enter URL"
        />
      </template>
      <template v-else>
        <button
          @click="editor?.chain().focus().toggleBold().run()"
          class="action"
          :class="{ active: editor.isActive('bold') }"
        >
          <Iconsax
            name="TextBold"
            size="18"
            :type="editor.isActive('bold') ? 'bold' : 'linear'"
          />
        </button>
        <button
          @click="editor?.chain().focus().toggleItalic().run()"
          class="action"
          :class="{ active: editor.isActive('italic') }"
        >
          <Iconsax
            name="TextItalic"
            size="18"
            :type="editor.isActive('italic') ? 'bold' : 'linear'"
          />
        </button>
        <button
          @click="editor?.chain().focus().toggleUnderline().run()"
          class="action"
          :class="{ active: editor.isActive('underline') }"
        >
          <Iconsax
            name="TextUnderline"
            size="18"
            :type="editor.isActive('underline') ? 'bold' : 'linear'"
          />
        </button>
        <button
          @click="editor?.chain().focus().toggleCode().run()"
          class="action"
          :class="{ active: editor.isActive('code') }"
        >
          <Iconsax
            name="Scroll"
            size="18"
            :type="editor.isActive('code') ? 'bold' : 'linear'"
          />
        </button>
        <button
          @click="toggleLinkInput"
          class="action"
          :class="{ active: editor.isActive('link') }"
        >
          <Iconsax
            name="Link1"
            class="noscale"
            size="18"
            :type="editor.isActive('link') ? 'bold' : 'linear'"
          />
        </button>
      </template>
    </bubble-menu>
    <div class="content-display" v-if="content">
      <h3>Editor Content:</h3>
      <div v-html="content"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Editor, EditorContent, BubbleMenu } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import BubbleMenuPlugin from "@tiptap/extension-bubble-menu";

const editor = ref<Editor>();
const content = ref<string>("<p>Hello World!</p>");
const showLinkInput = ref(false);
const linkHref = ref("");

const toggleLinkInput = () => {
  showLinkInput.value = !showLinkInput.value;
  if (showLinkInput.value) {
    linkHref.value = editor.value?.getAttributes("link").href || "";
  }
};

const setLink = () => {
  if (linkHref.value.trim()) {
    editor.value
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: linkHref.value,
        target: linkHref.value.startsWith("/") ? "_self" : "_blank",
      })
      .run();
  } else {
    editor.value?.chain().focus().extendMarkRange("link").unsetLink().run();
  }
  showLinkInput.value = false;
  editor.value?.chain().focus().run();
};

const hideLinkInput = () => {
  showLinkInput.value = false;
  editor.value?.chain().focus().run();
};

const handleClickOutside = (event: MouseEvent) => {
  const bubbleMenu = document.querySelector(".tippy-content");
  if (bubbleMenu && !bubbleMenu.contains(event.target as Node)) {
    hideLinkInput();
  }
};

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);

  editor.value = new Editor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        autolink: true,
      }),
      Underline,
      BubbleMenuPlugin,
    ],
    content: "<p>Hello World!</p>",
    onUpdate: ({ editor }) => {
      content.value = editor.getHTML();
    },
  });
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
  editor.value?.destroy();
});
</script>

<style lang="scss">
.tippy-content {
  & > div {
    background-color: red;
    border-radius: 8px;
    background-color: #0c0c0c;
    border: 1px solid #282828;
    padding: 5px;
    display: flex;
    overflow: hidden;
    transition: border .2s ease-in-out;

    &:hover {
      border: 1px solid #2f2f2f;
    }

    button {
      background-color: #0c0c0c;
      border: none;
      outline: none;
      color: #ffffffbb;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background .2s ease-in-out, color .2s ease-in-out;
      border-radius: 4px;

      &:not(.active):hover {
        background-color: #121212;
        color: #ffffffff;
      }

      &.active {
        color: #ffffffff;
        svg:not(.noscale) {
          scale: 1.3;
        }
      }
    }

    input {
      background-color: #0c0c0c;
      border: none;
      outline: none;
      color: #ffffffbb;
      width: 150px;
      height: 30px;
      padding-inline: 10px;

      &:hover {
        background-color: #121212;
        color: #ffffffff;
      }
    }
  }
}
</style>
