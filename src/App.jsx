import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer } from 'react-leaflet'
import { useState, useEffect } from 'react'
import { baseUrl } from './data/api'
import MarkerComponent from './components/marker-component'

const App = () => {

  const [address, setAddress] = useState(null)
  const [ipAddress, setIpAddress] = useState('192.212.174.101')

  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/


  const getInitialData = async () => {
    try {
      const res = await fetch(`${baseUrl}&ipAddress=192.212.174.101`)
      const data = await res.json()
      console.log(data)
      setAddress(data)
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    getInitialData()
  }, [])

  const getEnteredAddress = async () => {
    const res = await fetch(`
    ${baseUrl}&${checkIpAddress.test(ipAddress) ? `ipAddress=${ipAddress}` : checkDomain.test(ipAddress) ? `domain=${ipAddress}` : ''}
    `)

    const data = await res.json()
    setAddress(data)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    getEnteredAddress()
    setIpAddress('')
  }

  return (
    <section >
      <div className='absolute -z-10'>
        <img src="/pattern-bg-desktop.png" alt="pattern" className='w-full h-80 object-cover' />
      </div>
      <article className='p-8'>
        <h1 className='text-2xl text-center text-white font-bold mb-4'>IP Address Tracker</h1>
        <form
          autoComplete='off'
          onSubmit={handleSubmit}
          className='flex items-center justify-center max-w-2xl mx-auto'>
          <input
            required
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            className='py-2 px-4 rounded-l-lg w-full'
            type="text"
            placeholder="Search for an IP address" />
          <button type="submit" className='bg-black p-3.5 rounded-r-lg'>
            <img src="/icon-arrow.svg" alt="icon" className='w-full h-full' />
          </button>
        </form>
      </article>
      {address && (
        <>
          <article className='p-4'>
            <div className='bg-white rounded-lg shadow p-8 mx-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-8 max-w-6xl lg:mx-auto text-center md:text-left  sm:-mb-64 relative' style={{ zIndex: 10000 }}>
              <div className='uppercase lg:border-r lg:border-slate-400'>
                <h2 className='text-sm font-bold text-slate-500 tracking-wider mb-3'>Ip Address</h2>
                <p className='text-slate-900 font-bold text-lg md:text-xl xl:text-2xl'>{address?.ip}</p>
              </div>

              <div className='uppercase lg:border-r lg:border-slate-400'>
                <h2 className='text-sm font-bold text-slate-500 tracking-wider mb-3'>Location</h2>
                <p className='text-slate-900 font-bold text-lg md:text-xl xl:text-2xl'>{address.location.city}, {address.location.region} </p>
              </div>

              <div className='uppercase lg:border-r lg:border-slate-400'>
                <h2 className='text-sm font-bold text-slate-500 tracking-wider mb-3'>Timezone</h2>
                <p className='text-slate-900 font-bold text-lg md:text-xl xl:text-2xl'>UTC {address.location.timezone} </p>
              </div>
              <div>
                <h2 className='text-sm font-bold text-slate-500 tracking-wider mb-3'>ISP</h2>
                <p className='text-slate-900 font-bold text-lg md:text-xl xl:text-2xl'>{address.isp}</p>
              </div>
            </div>
          </article>
          <MapContainer style={{ height: '600px', width: "100vw" }} center={[address.location.lat, address.location.lng]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerComponent address={address} />
          </MapContainer>
        </>
      )}
    </section>
  )
}

export default App