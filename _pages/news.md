---
layout: collection
title: "News"
permalink: /news/
---
{% assign news_posts = site.posts | where_exp: 'post', 'post.categories contains "News"' %}
{% assign news_by_year = news_posts | group_by_exp: 'post', 'post.date | date: "%Y"' | sort: 'name' | reverse %}

<div class="collection collection--news">
  {% for year in news_by_year %}
  {% assign year_items = year.items | sort: 'date' | reverse %}
  <section class="collection__year">
    <h2 class="collection__heading">{{ year.name }}</h2>
    <ul class="collection-list">
      {% for post in year_items %}
      <li class="collection-list__item">
        <div class="collection-list__newsdate">
          <p class="collection-list__date">
            <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%b %-d" }}</time>
          </p>
        </div>
        <div class="collection-list__meta">
          <a class="collection-list__title" href="{{ post.url | relative_url }}">{{ post.title }}</a>
        </div>
      </li>
      {% endfor %}
    </ul>
  </section>
  {% endfor %}
</div>
