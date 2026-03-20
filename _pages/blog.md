---
layout: archive
title: "Blog"
permalink: /blog/
---

{% assign all_posts = site.posts | sort: "date" | reverse %}

<div class="blog-intro content-panel">
  <p class="section-label">Magazine Rack</p>
  <h2 class="panel-title">Open one issue at a time.</h2>
  <p>
    This view gathers every post into a compact rack. Expand a card to preview the piece, then
    jump into the full entry.
  </p>
</div>

<div class="blog-rack">
  {% for post in all_posts %}
    {% assign category = post.categories | first | default: "Post" %}
    {% assign thumb = post.thumbnail %}
    {% capture summary %}{{ post.abstract_short | default: post.summary | default: post.excerpt | markdownify | strip_html | strip_newlines | strip }}{% endcapture %}
    <details class="rack-item"{% if forloop.first %} open{% endif %}>
      <summary class="rack-item__summary">
        <div class="rack-item__cover">
          {% if thumb %}
            {% if thumb contains '://' %}
              <img src="{{ thumb }}" alt="{{ post.title | escape }} cover">
            {% else %}
              <img src="{{ thumb | relative_url }}" alt="{{ post.title | escape }} cover">
            {% endif %}
          {% else %}
            <span class="rack-item__placeholder">{{ category | slice: 0, 1 | upcase }}</span>
          {% endif %}
        </div>

        <div class="rack-item__content">
          <p class="rack-item__meta">{{ category }} / {{ post.date | date: "%B %-d, %Y" }}</p>
          <h3 class="rack-item__title">{{ post.title }}</h3>
        </div>

        <span class="rack-item__toggle" aria-hidden="true"></span>
      </summary>

      <div class="rack-item__body">
        <p>{{ summary | truncate: 260 }}</p>
        <div class="rack-item__actions">
          <a class="text-link" href="{{ post.url | relative_url }}">Read entry</a>
          {% if post.external_link %}
            <a class="text-link" href="{{ post.external_link }}">External link</a>
          {% endif %}
        </div>
      </div>
    </details>
  {% endfor %}
</div>
