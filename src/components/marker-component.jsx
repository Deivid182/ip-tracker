import { useEffect, useMemo } from "react"
import { Marker, Popup, useMap } from "react-leaflet"
import iconImage from "../assets/images/icon-location.svg"
import L from "leaflet"


const icon = L.icon({
  iconSize: [32, 40],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: iconImage
})

export default function MarkerComponent({ address }) {
  const position = useMemo(() => {
    return [address.location.lat, address.location.lng]
  }, [address.location.lat, address.location.lng])
  const map = useMap()

  useEffect(() => {
    map.flyTo(position, 13, {
      animate: true,
    })
  }, [map, position])

  return (
    <>
      <Marker icon={icon} position={position}>
        <Popup>This is the location of the IP Address or Domain</Popup>
      </Marker>
    </>
  )
}