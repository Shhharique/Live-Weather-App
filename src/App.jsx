import React, { useEffect, useState, useSyncExternalStore } from 'react'
import TopButtons from './components/TopButtons';
import Inputs from './components/Inputs';
import TImeAndLocation from './components/TImeAndLocation';
import TempAndDetails from './components/TempAndDetails';
import Forecast from './components/Forecast';
import getFormattedWeatherData from './services/weatherServices';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const App = () => {

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase()+string.slice(1);
  }

  const [query, setQuery] = useState({q: 'dubai'});
  const [units, setUnits] = useState('metric');
  const [weather, setWeather] = useState(null);

  const getWeather = async () => {
    const cityname = query.q ? query.q : `current location`
    toast.info(`fetching weather data for ${capitalizeFirstLetter(cityname)}`)
    await getFormattedWeatherData({...query, units}).then((data)=>{
      toast.success(`Fetched weather data for ${data.name}, ${data.country}`)
      setWeather(data);
    });

  }
  useEffect(()=>{getWeather();}, [query, units]);

  const formatBackground = () => {
    if(!weather) return 'from-cyan-600 to-blue-700'
    const threshold = units==='metric' ? 25 : 60;
    if(weather.temp <= threshold) return 'from-cyan-600 to-blue-700'
    return 'from-yellow-600 to-orange-700'
  }

  return (
    <div className={`mx-auto max-w-screen-lg mt-4 py-5 px-32 bg-gradient-to-br shadow-xl shadow-gray-400 ${formatBackground()}`}>
      <TopButtons setQuery={setQuery}/>
      <Inputs setQuery={setQuery} setUnits={setUnits}/>

      {weather && (<>
      
        <TImeAndLocation weather={weather}/>
        <TempAndDetails weather={weather} units={units}/>
        <Forecast title="3 hour step forecast" data={weather.hourly}/>
        <Forecast title="daily forecast" data={weather.daily}/>
      </>)}
      
      <ToastContainer autoClose={2500} hideProgressBar={true} theme='colored' />
    </div>
  )
}

export default App
