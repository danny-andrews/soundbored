<div>
  <button onClick={context.playSound}>{context.sound.displayName}</button>
  <audio preload="auto" style={{display: 'none'}} src={context.soundFilePath} />
</div>
