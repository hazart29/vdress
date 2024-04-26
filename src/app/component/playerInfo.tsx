const PlayerInfo: React.FC<{ player: Player }> = ({ player }) => {
    return (
      <div>
        <h2>{player.name}</h2>
        <p>ID: {player.id}</p>
        <p>Primogems: {player.primogems}</p>
        {/* tampilkan properti lainnya */}
      </div>
    );
  };
  
  export default PlayerInfo;