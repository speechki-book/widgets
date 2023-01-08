<style lang="scss" src="./Speaker.scss"></style>

<script>
import Player from '../Player/Player.svelte';

import { createEventDispatcher } from 'svelte';
import { selectedSpeaker } from '../../store';

export let speaker = {};

const dispatch = createEventDispatcher();

function select() {
    dispatch('select', speaker);
}

$: isActive = $selectedSpeaker === speaker.slug;
</script>

<button
    type="button"
    on:click|preventDefault|stopPropagation={select}
    class="speaker"
    class:active={isActive}
>
    {#if speaker.sample}
        <div class="speaker__sample">
            <Player src={speaker.sample} />
        </div>
    {/if}
    <div class="speaker__info">
        <div class="speaker__name">
            {speaker.name.eng}
            {#if speaker.provider_information && speaker.provider_information.icon}
                <div class="speaker__provider">
                    <img
                        class="speaker__provider-logo"
                        src={speaker.provider_information.icon}
                        alt={speaker.name.eng}
                    />
                </div>
            {/if}
        </div>
        {#if speaker.description}
            <span class="speaker__description">{speaker.description}</span>
        {/if}
    </div>
</button>
