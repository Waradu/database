<template>
  <div class="row_id page">
    <header>
      <h1>
        <NuxtLink class="link" :to="'/tables/' + row.table_id">
          <Iconsax name="ArrowLeft" size="18" color="#ffffff80" />
        </NuxtLink>
        {{ row.title }}
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
      <div class="content" v-html="content"></div>
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
  title: `Row: ${row.value?.title || "Loading..."}`,
});
</script>

<style lang="scss">
.row_id {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  padding: 80px;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    h1 {
      display: flex;
      align-items: center;
      gap: 10px;

      .link {
        margin-right: 20px;
      }
    }

    .tags {
      display: flex;
      gap: 10px;
      align-items: center;
      user-select: none;

      .tag {
        opacity: 0.9;
        padding: 4px;
        height: max-content;
        padding-inline: 10px;
        font-size: 12px;
        background-color: var(--color, #ffffff60);
        color: white;
        border-radius: 20px;
        border: 2px solid var(--color, #ffffff60);
      }
    }
  }

  .container {
    padding: 40px;
    padding-inline: 0;
    gap: 20px;
    border-radius: 28px;
    border: 1px solid #ffffff20;
    display: flex;
    align-items: center;
    flex-direction: column;

    .content {
      width: 60%;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }
}
</style>
