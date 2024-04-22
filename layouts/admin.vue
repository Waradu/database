<template>
  <div class="admin">
    <div class="sidebar">
      <h1>Admin Panel</h1>
      <div class="tabs">
        <div v-for="(tab, index) in tabs" :key="tab.text" class="tab" :class="{ 'active': active === index }" @click="navigate(tab.text, index)">
          <Iconsax class="icon" :name="tab.icon" thickness="2" size="18" :type="active === index ? 'bold' : 'linear'" />
          <span class="text">{{ tab.text }}</span>
        </div>
      </div>
      <div class="space"></div>
      <button class="logout" @click="logout">Logout</button>
    </div>
    <header>
      <input type="text" name="" id="" placeholder="Search" @input="searchAction(term)" v-model="term" />
      <div class="buttons">
        <button class="preview" @click="show_preview = true">
          <Iconsax class="icon" name="Eye" size="16px" thickness="2" />
          Preview
        </button>
        <button class="create" @click="createAction">
          <Iconsax class="icon" name="Add" size="16px" thickness="2" />
          Create new
        </button>
      </div>
    </header>
    <div class="main">
      <slot :create="createAction" :search="searchAction" />
    </div>
    <div :class="{ 'hidden': !show_preview }" class="wrapper" @click="show_preview = false">
      <div @click.stop class="iframe-toolbar">
        <form @submit.prevent="submit">
          <button type="submit" class="action">Go</button>
          <input id="location" type="text" placeholder="Location" value="/" />
        </form>
        <div class="actions">
          <Iconsax class="home action" name="Home2" size="18px" thickness="2" @click="home" />
          <Iconsax class="refresh action" name="Refresh" size="18px" thickness="2" @click="refresh" />
          <Iconsax class="close action" name="Add" size="18px" thickness="2" style="scale: 1.7; rotate: 45deg" @click="show_preview = false" />
        </div>
      </div>
      <div @click.stop class="iframe-wrapper">
        <iframe ref="iframe" src="/" frameborder="0" class="preview"></iframe>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const tabs = ref([
  { text: 'Overview', icon: 'Home2' },
  { text: 'Tables', icon: 'Grid7' },
  { text: 'Rows', icon: 'RowVertical' },
  { text: 'Tags', icon: 'Tag' }
]);
const show_preview = ref(false);
const active = ref(4);
const iframe = ref<HTMLIFrameElement>();
const router = useRouter();
const route = useRoute();
const term = ref("")
const supabase = useSupabaseClient();

function setInitialActiveTab() {
  const path = route.path.toLowerCase();
  const foundTab = tabs.value.find(tab => `/admin/${tab.text.toLowerCase()}` === path);
  active.value = foundTab ? tabs.value.indexOf(foundTab) : 0;
}

setInitialActiveTab();

function navigate(tabText: string, index: number) {
  active.value = index;
  const path = tabText.toLowerCase() === 'overview' ? '/admin' : `/admin/${tabText.toLowerCase()}`;
  router.push(path);
}

function refresh() {
  if (!iframe.value) return;
  iframe.value.contentWindow?.location.reload();
}

function home() {
  if (!iframe.value) return;
  iframe.value.src = "/";
}

const createAction = ref(() => {
  console.error('Call error');
});

provide('createAction', createAction);

const searchAction = ref((term: string) => {
  console.error('Call error');
});

provide('searchAction', searchAction);

function submit(event: Event) {
  if (!iframe.value) return;
  const form = event.target as HTMLFormElement;
  if (!form) return;
  const input = form.elements[1] as HTMLInputElement;
  if (!input || !input.value) return;
  iframe.value.src = input.value;
}

function logout() {
  supabase.auth.signOut()
  navigateTo("/")
}

useHead({
  title: "Admin Panel",
});
</script>

<style>
@import url("~/assets/admin/layout.scss");
@import url("~/assets/admin/global.scss");
</style>
