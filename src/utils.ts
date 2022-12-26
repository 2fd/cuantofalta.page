

export function celcius(temp: number) {
  const int = temp | 0
  const dotPosition = String(temp).indexOf('.')
  if (dotPosition === -1) {
    return `${int}º`
  }

  return `${int}º${String(temp).slice(dotPosition+1, dotPosition + 3)}`
}


export function daysTo(days: number) {
  if (days > 1) {
    return `Faltan ${days} días para el casorio!!!`
  }

  if (days === 1) {
    return `Mañana es el casorio!!!`
  }


  if (days === 0) {
    return `Hoy es el casorio!!!`
  }

  return `Felicidades!!!`
}