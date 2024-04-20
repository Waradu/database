<template>
  <div class="row page">
    <header class="default">
      <h1>
        <NuxtLink class="link" :to="'/tables/' + row.table_id">
          <Iconsax name="ArrowLeft" size="18" color="#ffffff80" />
        </NuxtLink>
        <div class="number">{{ row.pos }}.</div>
        {{ row.name }}
      </h1>
      <div class="tags">
        <div
          v-for="tag in databaseStore.getRowTags(row.id.toString())"
          :key="tag.id"
          class="tag"
          :style="{ '--color': tag.color + '60' }"
        >
          {{ tag.name }}
        </div>
      </div>
    </header>
    <div class="container">
      <div class="html-content" v-html="content"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Prism from "prismjs";
import 'prismjs/components/prism-scss.min.js';
import 'prismjs/components/prism-markup-templating.min.js';
import 'prismjs/components/prism-javascript.min.js';

const route = useRoute();
const databaseStore = useDatabaseStore();

const rowId = computed(() => route.params.id as string);

const row = computed(() => {
  const data = databaseStore.getRow(rowId.value);
  if (!data) throw new Error("Row not found");
  return data;
});
const content = ref("");

onMounted(async () => {
  content.value = await databaseStore.fetchRowContent(row.value.id.toString());

  nextTick(() => {
    document.querySelectorAll("pre.highlight").forEach((element) => {
      const classList = element.className.split(/\s+/);
      const langClass = classList.find((cls) => cls !== "highlight" && cls !== "language");
      if (langClass) {
        element.children[0].classList.add("language-" + langClass);
      }
      Prism.highlightElement(element.children[0], false);
    });
  });
});

useHead({
  title: `Row: ${row.value?.name || "Loading..."}`,
});
</script>

<style lang="scss">
@import url('~/assets/pages/rows.scss');
</style>
