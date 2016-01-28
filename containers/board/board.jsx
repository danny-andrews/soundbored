<div>
  {context.sounds.map((sound, i) => <SoundPlayer key={sound.id} playSound={context.playSound} sound={sound} soundPlayer={context.soundPlayers[i]} previousAction={context.previousAction} />)}
  <div>
    <button className='killswitch' style={{color: 'red', fontSize: '20px', fontWeight: 'bold', marginTop: '10px'}} onClick={context.killAllSounds}>Killswitch</button>
  </div>
</div>
