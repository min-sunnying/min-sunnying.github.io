---
layout: collection
title: "News"
permalink: /news/
---

<div class="News">
  {% for post in site.posts %}
    {% if post.categories contains "News" %}
      <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
      <p>{{ post.excerpt }}</p>
    {% endif %}
  {% endfor %}
</div>
