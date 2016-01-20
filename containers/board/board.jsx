<div>
  {context.sounds.map(sound => <SoundPlayer key={sound.id} playSound={context.playSound} sound={sound} />)}
</div>
