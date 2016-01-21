<span>
  <button onClick={context.playSound}>{context.sound.displayName}</button>
  {context.players.map(player => <audio key={player.id} preload="auto" onEnded={player.onEnded} style={{display: 'none'}} src={context.soundFilePath} ></audio>)}
</span>
