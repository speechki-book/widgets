<style lang="scss" src="./SpeakerTags.scss"></style>

<script>
export let speaker = {};

let showList = false;

function onClick() {
    showList = !showList;
}

$: tagsStr = speaker.meta_tags.join(', ')
</script>

<div class="speaker-tags">
    <button class="speaker-tags__trigger" on:click={onClick}>?</button>
    {#if showList}
        <div class="speaker-tags__list" on:click={onClick}>{tagsStr}</div>
    {/if}
</div>
