<template>
  <div class="admin">
    <div class="sidebar">
      <h1>Admin Panel</h1>
      <div class="tabs">
        <div class="tab" :class="{ 'active': (active == 0) }">
          <Iconsax class="icon" name="Home2" thikness="2" size="18" @click="active = 0" :type="active == 0 ? 'bold' : 'linear'" />
          <span class="text">Overview</span>
        </div>
        <div class="tab" :class="{ 'active': (active == 1) }">
          <Iconsax class="icon" name="Grid7" thikness="2" size="18" @click="active = 1" :type="active == 1 ? 'bold' : 'linear'" />
          <span class="text">Tables</span>
        </div>
        <div class="tab" :class="{ 'active': (active == 2) }">
          <Iconsax class="icon" name="RowVertical" thikness="2" size="18" @click="active = 2" :type="active == 2 ? 'bold' : 'linear'" />
          <span class="text">Rows</span>
        </div>
        <div class="tab" :class="{ 'active': (active == 3) }">
          <Iconsax class="icon" name="Tag" thikness="2" size="18" @click="active = 3" :type="active == 3 ? 'bold' : 'linear'" />
          <span class="text">Tags</span>
        </div>
      </div>
      <div class="space"></div>
      <button class="logout">Logout</button>
    </div>
    <header>
      <input type="text" name="" id="" placeholder="Search" />
      <button class="preview" @click="show_preview = true">
        <Iconsax
          class="icon"
          name="Eye"
          size="16px"
          thickness="2"
        />
        Preview
      </button>
    </header>
    <div class="main">
      <slot />
    </div>
    <div :class="{ 'hidden': !show_preview }" class="wrapper" @click="show_preview = false">
      <div @click.stop class="iframe-wrapper">
        <form @submit.prevent="submit($event as SubmitEvent)">
          <button type="submit" class="action">Go</button>
          <input id="location" type="text" placeholder="Location" value="/" />
        </form>
        <div class="actions">
          <Iconsax
            class="home action"
            name="Home2"
            size="18px"
            thickness="2"
            @click="home"
          />
          <Iconsax
            class="refresh action"
            name="Refresh"
            size="18px"
            thickness="2"
            @click="refresh"
          />
          <Iconsax
            class="close action"
            name="Add"
            size="18px"
            thickness="2"
            style="scale: 1.7; rotate: 45deg"
            @click="show_preview = false"
          />
        </div>
        <iframe ref="iframe" src="/" frameborder="0" class="preview"></iframe>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const show_preview = ref(false);
const active = ref(0);
const iframe = ref<HTMLIFrameElement>();

function refresh() {
  if (!iframe.value) return;

  iframe.value.contentWindow?.location.reload();
}

function home() {
  if (!iframe.value) return;

  iframe.value.src = "/";
}

function submit(event: SubmitEvent) {
  if (!iframe.value) return;

  const form = event.target as HTMLFormElement;
  if (!form) return;

  const input = form.elements[1] as HTMLInputElement;
  if (!input || !input.value) return;

  iframe.value.src = input.value;
}

useHead({
  title: "Admin Panel",
});
</script>

<style>
@import url("~/assets/admin.scss");
</style>
