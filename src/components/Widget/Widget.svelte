<style lang="scss" src="./Widget.scss"></style>

<script>
import { onMount, onDestroy } from 'svelte';

import Speaker from '../Speaker/Speaker.svelte';
import Loader from '../Loader/Loader.svelte';
import Search from '../Search/Search.svelte';
import SearchTags from '../SearchTags/SearchTags.svelte';

import { fetchSpeakersWithRetry as fetchSpeakers } from '../../api/speakers';

import { selectedSpeaker } from '../../store';

let speakers = [];
let loading = false;
let filter = '';
let filterTags = '';

const getParams = () => {
    const observeParams = ['customer_id', 'book_language'];
    const params = Array.from(new URLSearchParams(location.search).entries()).filter(([param]) =>
        observeParams.includes(param)
    );
    return Object.fromEntries(params);
};

onMount(() => {
    const { customer_id, book_language } = getParams();
    fetch(customer_id, book_language);
    setupPostMessage();
});

onDestroy(() => {
    window.removeEventListener('message', changeLanguage);
});

function fetch(customer_id, bookLanguage) {
    loading = true;

    fetchSpeakers(customer_id, bookLanguage)
        .then((result) => {
            speakers = result;
        })
        .catch((e) => {
            speakers = [];
        })
        .finally(() => (loading = false));
}

function setupPostMessage() {
    window.addEventListener('message', changeLanguage);
}

function changeLanguage({ data }) {
    if (data.event === 'change_language') {
        filter = '';
        selectedSpeaker.set('');
        fetch(getParams().customer_id, data.data.language);
    }
}

function select(event) {
    const { slug, id, name } = event.detail;
    selectedSpeaker.set(slug);

    const data = {
        event: 'speechki-select',
        data: {
            slug,
            id,
            name: name.eng,
        },
    };

    if (window.parent && window.parent !== window) {
        window.parent.postMessage(data, '*');
    }
}

function setFilter(event) {
    filter = event.detail;
}

function setFilterTags(event) {
    filterTags = event.detail;
}

function getName(speaker) {
    const {
        name: { eng = '' },
        slug = '',
    } = speaker;
    return eng || slug;
}

$: filteredSpeakers = speakers.slice().filter((s) => {
    const regex = new RegExp(filter, 'gi');
    let metaTags = true;

    if (filterTags.length && s.meta_tags.length) {
        metaTags = filterTags.map(t => t.slug).some(t => s.meta_tags.includes(t))
    }

    return regex.test(getName(s)) && metaTags;
});
</script>

<div class="widget">
    <div class="widget__search-wrap">
        <Search bind:search={filter} on:search={setFilter} />
        <SearchTags on:searchTags={setFilterTags} />
    </div>
    {#if loading}
        <Loader />
    {:else}
        <div class="widget__inner">
            <ul class="widget__list list">
                {#each filteredSpeakers as speaker}
                    <li class="list__item">
                        <Speaker {speaker} on:select={select} class="list__item" />
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</div>
