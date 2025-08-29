---
layout: "layouts/base.njk"
title: "Pack Calendar"
eleventyNavigation:
  key: "Calendar"
  order: 3
---
<section class="section">
  <div class="container">
    <h1 class="title has-text-centered">{{ title }}</h1>
    <div class="columns">
      <div class="column is-full">
        <div style="height: 450px; width: 100%;">
          <iframe src="https://calendar.google.com/calendar/embed?src=f3987831cb013970d61b4e9a496d348a965e9748d99aa729884f2bcc90f56837%40group.calendar.google.com&ctz=America%2FChicago" style="border: 0; width:100%; height:100%;" frameborder="0" scrolling="no"></iframe>
        </div>

      </div>
    </div>
  </div>
</section>

<style>
  @media screen and (min-width: 1024px) {
    iframe {
      height: 600px !important;
    }
  }
</style>
