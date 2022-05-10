<style lang="scss" src="./Widget.scss"></style>

<script>
/** @TODOS
 *  [t][] selection events
 *  [ ] observe query params to reload speakers
 *  [x] loading state
 *  [x] change endpoint for speakers
 *  [x] sample stop others
 *
 */
import { onMount } from 'svelte';

import Speaker from '../Speaker/Speaker.svelte';
import Loader from '../Loader/Loader.svelte';
import { fetchSpeakers } from '../../api/speakers';

import { selectedSpeaker } from '../../store';

let speakers = [];
let loading = false;

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

function fetch(customer_id, bookLanguage) {
    loading = true;

    fetchSpeakers(customer_id, bookLanguage)
        .then((result) => {
            speakers = result;
        })
        .finally(() => (loading = false));
}

function setupPostMessage() {
    window.addEventListener('message', ({ data }) => {
        if (data.event === 'change_language') {
            fetch(getParams().customer_id, data.data.language);
        }
    });
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
</script>

<svelte:window />
<div class="widget">
    <div class="widget__inner">
        {#if loading}
            <Loader />
        {:else}
            <ul class="widget__list list">
                {#each speakers as speaker}
                    <li class="list__item">
                        <Speaker {speaker} on:select={select} class="list__item" />
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
</div>
