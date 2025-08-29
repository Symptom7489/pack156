---
layout: "layouts/base.njk"
title: "My Adventures"
permalink: "/adventures/index.html"
eleventyNavigation:
  key: "Adventures"
  order: 4
---

<section class="section">
  <div class="container">
    <h1 class="title has-text-centered">{{ title }}</h1>

    <div class="columns is-multiline is-centered">
      {% for adventure in collections.adventures %}
      <div class="column is-one-quarter-desktop is-one-third-tablet is-half-mobile">
        <div class="card">
          <div class="card-image">
            <figure class="image is-square">
              <a href="{{ adventure.url }}">
                <img src="{{ adventure.data.photo }}" alt="{{ adventure.data.title }}">
              </a>
            </figure>
          </div>
          <div class="card-content has-text-centered">
            <p class="title is-6"><a href="{{ adventure.url }}">{{ adventure.data.title }}</a></p>
          </div>
        </div>
      </div>
      {% endfor %}
    </div>

  </div>
</section>
