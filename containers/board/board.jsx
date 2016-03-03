<div>
  {context.sounds.map((sound, i) => <SoundPlayer key={sound.id} playSound={context.playSound} sound={sound} />)}
  <div>
    <a className='killswitch waves-effect waves-light btn-large red' style={{fontWeight: 'bold', marginTop: '10px', marginLeft: '6px'}} onClick={context.killAllSounds}>Stop{context.killSoundsKey}<i className="material-icons right">stop</i></a>
  </div>
</div>
