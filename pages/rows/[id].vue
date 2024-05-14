<template>
  <div class="row page">
    <header class="default">
      <h1>
        <div class="header-wrapper">
          <NuxtLink class="link" :to="'/tables/' + row.table_id">
            <Iconsax
              name="ArrowLeft"
              size="18"
              color="#ffffff80"
              thickness="3"
            />
          </NuxtLink>
          <div class="number">{{ row.pos }}.</div>
        </div>
        <div class="header-text">{{ row.name }}</div>
      </h1>
      <div class="tags">
        <div
          v-for="tag in store.getRowTags(row.id)"
          :key="tag.id"
          class="tag"
          :style="{
            '--color': tag.color + '50',
            '--full-color': tag.color + '80',
          }"
        >
          {{ tag.name }}
        </div>
      </div>
    </header>
    <article>
      <div class="article">
        <template v-for="comp in content">
          <Block :type="comp.type" :data="comp.data" />
        </template>
      </div>
    </article>
  </div>
</template>

<script lang="ts" setup>
import Prism from "prismjs";
import "prismjs/components/prism-scss.min.js";
import "prismjs/components/prism-markup-templating.min.js";
import "prismjs/components/prism-javascript.min.js";
import type { Block } from "~/types/types";
const toast = useToastStore();
const { $database } = useNuxtApp();

const route = useRoute();
const store = useDatabaseStore();

const id = computed(() => Number(route.params.id));

const row = computed(() => {
  const data = store.getRow(id.value);

  if (!data && store.loading) {
    return {
      id: 0,
      name: "Loading",
      pos: 0,
      publish_date: "",
      table_id: 0,
    };
  } else if (!data) {
    toast.error("Error", "Row not found");
    throw createError({
      statusCode: 404,
      message: "Row not found",
    });
  }

  return data;
});

const content = ref<Block[]>([
  {
    type: "heading",
    data: {
      content: "Loading...",
      size: 1,
    },
  },
] as Block[]);

const fetchData = async (rowId: number) => {
  const data = await $database.fetchRowContent(rowId);

  if (!data) {
    content.value = [];
    return;
  }

  if (data.length === 0 && !store.loading) {
    toast.info("This post is empty", "This might be on purpose as a placeholder");
  }

  content.value = data;

  nextTick(() => {
    document.querySelectorAll("pre.highlight").forEach((element) => {
      const classList = element.className.split(/\s+/);
      const langClass = classList.find(
        (cls) => cls !== "highlight" && cls !== "language"
      );
      if (langClass) {
        element.children[0].classList.add("language-" + langClass);
      }
      Prism.highlightElement(element.children[0], false);
    });
  });
};

watch(
  () => row.value.id,
  async (newId) => {
    content.value = [];
    await fetchData(newId);
  },
  { immediate: true }
);

useHead({
  title: `Row: ${row.value?.name || "Loading..."}`,
});
</script>

<style lang="scss">
@import url("~/assets/pages/rows.scss");
</style>
