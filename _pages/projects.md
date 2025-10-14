---
layout: collection
title: "Projects"
permalink: /projects/
---
{% assign project_posts = site.posts | where_exp: 'post', 'post.categories contains "Projects"' %}
{% assign projects_by_year = project_posts | group_by_exp: 'post', 'post.date | date: "%Y"' | sort: 'name' | reverse %}

<div class="collection collection--projects">
  {% for year in projects_by_year %}
  {% assign year_items = year.items | sort: 'date' | reverse %}
  <section class="collection__year">
    <h2 class="collection__heading">{{ year.name }}</h2>
    <ul class="collection-list">
      {% for post in year_items %}
      <li class="collection-list__item">
        {% assign thumb = post.thumbnail %}
        <div class="collection-list__thumb">
          {% if thumb %}
          {% if thumb contains '://' %}
          <img src="{{ thumb }}" alt="{{ post.title | escape }} thumbnail">
          {% else %}
          <img src="{{ thumb | relative_url }}" alt="{{ post.title | escape }} thumbnail">
          {% endif %}
          {% else %}
          <span class="collection-list__placeholder">{{ post.title | slice: 0, 1 | upcase }}</span>
          {% endif %}
        </div>
        <div class="collection-list__meta">
          <a class="collection-list__title" href="{{ post.url | relative_url }}">{{ post.title }}</a>
          {% if post.role %}
          <p class="collection-list__role">{{ post.role }}</p>
          {% endif %}
          {% if post.organization %}
          <p class="collection-list__org">{{ post.organization }}</p>
          {% endif %}
          {% if post.location %}
          <p class="collection-list__location">{{ post.location }}</p>
          {% endif %}
          {% if post.journal %}
          <p class="collection-list__venue">{{ post.journal }}</p>
          {% endif %}
          {% if post.authors %}
          <p class="collection-list__authors">{{ post.authors }}</p>
          {% endif %}
          {% assign summary = post.summary | default: post.excerpt %}
          {% if summary %}
          <p class="collection-list__abstract">{{ summary | markdownify | strip_html }}</p>
          {% endif %}
          {% if post.external_link %}
          <p class="collection-list__links">
            <a class="collection-list__link" href="{{ post.external_link }}">Full text</a>
          </p>
          {% endif %}
        </div>
      </li>
      {% endfor %}
    </ul>
  </section>
  {% endfor %}
</div>
