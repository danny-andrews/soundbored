<div>
  {context.sounds.map((sound, i) => <SoundPlayer key={sound.id} playSound={context.playSound} sound={sound} soundPlayer={context.soundPlayers[i]} />)}
</div>
