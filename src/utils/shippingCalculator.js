export const calculateShipping = (distance, mode) => {
    const rates = {
      bus: { costPerKm: 2, speed: 50 },
      flight: { costPerKm: 10, speed: 700 },
    };
  
    const selectedMode = rates[mode];
    const cost = distance * selectedMode.costPerKm;
    const time = distance / selectedMode.speed;
  
    return { mode, cost, time };
  };
  