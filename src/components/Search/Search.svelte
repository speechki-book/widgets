<style lang="scss" src="./Search.scss"></style>

<script>
import { createEventDispatcher, onDestroy } from 'svelte';

export let search = '';
let timeout;

const dispatch = createEventDispatcher();

function clear() {
    dispatch('search', '');
}

function onInput(event) {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
        dispatch('search', event.target.value);
    }, 250);
}
</script>

<div class="search">
    <input
        bind:value={search}
        type="text"
        placeholder="Type name"
        class="search__input"
        on:keyup={onInput}
        on:keydown={onInput}
    />
    {#if search}
        <button class="search__clear" type="button" on:click={clear}>✕</button>
    {/if}
</div>
