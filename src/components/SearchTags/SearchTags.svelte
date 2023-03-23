<style lang="scss" src="./SearchTags.scss"></style>

<script>
import { onMount, createEventDispatcher } from 'svelte';
import Loader from '../Loader/Loader.svelte';
import { fetchSpeechSettingsTagsWithRetry as fetchSpeechSettingsTags } from '../../api/speakers';

export let search = '';

let loading = false;
let tags = [];
let show = 0;

const dispatch = createEventDispatcher();

onMount(() => {
    fetch();
});

function fetch() {
    loading = true;

    fetchSpeechSettingsTags()
        .then((result) => {
            tags = result.map(tag => ({
                ...tag,
                selected: false
            }));
        })
        .catch((e) => {
            tags = [];
        })
        .finally(() => (loading = false));
}

function clear() {
    dispatch('search', '');
}

function onInputClick() {
    show = 1;
}

function onMouseLeave() {
    show = 0;
}

function handleClick(slug) {
    const idx = tags.findIndex(t => t.slug === slug);
    const tag = tags[idx];
    const { selected = false } = tag;

    tags[idx].selected = !selected;

    dispatch('searchTags', tags.filter(t => t.selected));
}

$: seletedTagsStr = tags.filter(t => t.selected).map(t => t.name).join(', ')
</script>

<div class="search-tags">
    <input
        type="text"
        placeholder="Type tag"
        class="search-tags__input"
        on:focus={onInputClick}
        value={seletedTagsStr}
    />
    {#if search}
        <button class="search-tags__clear" type="button" on:click={clear}>✕</button>
    {/if}
    <div class="search-tags__dropdown" data-show={show} on:mouseleave={onMouseLeave}>
        {#if loading}
            <Loader />
        {:else}
            <ul class="search-tags__list list">
                {#each tags as tag}
                    {#if tag.selected}
                        <li class="list__item is-selected" on:click={handleClick(tag.slug)}>{tag.name}</li>
                    {:else}
                        <li class="list__item" on:click={handleClick(tag.slug)}>{tag.name}</li>
                    {/if}
                {/each}
            </ul>
        {/if}
    </div>
</div>
