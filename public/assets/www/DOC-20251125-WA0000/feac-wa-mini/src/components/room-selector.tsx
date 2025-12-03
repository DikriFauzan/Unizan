'use client'

interface Room {
  id: string
  name: string
  type: string
}

interface RoomSelectorProps {
  rooms: Room[]
  selectedRoom: Room
  onRoomChange: (room: Room) => void
}

export function RoomSelector({ rooms, selectedRoom, onRoomChange }: RoomSelectorProps) {
  return (
    <div className="room-selector">
      {rooms.map((room) => (
        <button
          key={room.id}
          onClick={() => onRoomChange(room)}
          className={`room-tab ${selectedRoom.id === room.id ? 'active' : ''}`}
        >
          {room.name}
        </button>
      ))}
    </div>
  )
}