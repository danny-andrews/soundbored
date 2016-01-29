<div>
  {context.sounds.map((sound, i) => <SoundPlayer key={sound.id} playSound={context.playSound} sound={sound} />)}
  <div>
    <a className='killswitch btn-floating btn-large red' style={{fontWeight: 'bold', marginTop: '10px', marginLeft: '6px'}} onClick={context.killAllSounds}><i className="material-icons">stop</i></a>
  </div>
</div>
