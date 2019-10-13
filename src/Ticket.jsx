import React, {Component} from 'react';
import './App.scss';

class Ticket extends Component{
  transfersText(ticket){
    switch(ticket.stops.length){
      case 1: return '1 пересадка';
      case 2: return '2 пересадки';
      case 3: return '3 пересадки';
      default: return 'Без пересадок';
    }
  }

  flightTime(date, duration){
    const time = new Date(date),
          hours = time.getUTCHours(),
          minutes = time.getMinutes(),
          arrivalTime = new Date(date);

    arrivalTime.setMinutes(time.getMinutes() + duration);

    const arrivalHours = arrivalTime.getUTCHours(),
          arrivalMinutes = arrivalTime.getMinutes();

    return `${this.leadingZero(hours)}:${this.leadingZero(minutes)} -
    ${this.leadingZero(arrivalHours)}:${this.leadingZero(arrivalMinutes)}`;
  }

  flightDuration(date, duration){
    const startFlight = new Date(date),
          endFlight = new Date(date).setMinutes(startFlight.getMinutes() + duration),
          durationTime = endFlight - Date.parse(startFlight),
          durDays = Math.floor(durationTime/(1000*60*60*24)),
          durHours = Math.floor(durationTime/(1000*60*60) % 24),
          durMinutes = Math.floor((durationTime/1000/60) % 60);

    return `${durDays ? durDays + 'д' : ''}  ${durHours}ч ${durMinutes}м`
  }

  leadingZero(num){
    if(num < 10){
      return '0' + num
    }
    return num;
  }

  render(){
    const ticket = this.props.ticket;
    return(
      <div className="Ticket box">
        <div className="Ticket__row top-line">
          <div className="Ticket__price">{ticket.price} P</div>
          <div className="Ticket__col">
            <img src="/images/company-logo.png" />
          </div>
        </div>
        <div className="Ticket__row">
          <div className="Ticket__col">
            <div className="Ticket__col-top">
              {ticket.segments[0].origin} - {ticket.segments[0].destination}
            </div>
            <div className="Ticket__col-bottom">{this.flightTime(ticket.segments[0].date, ticket.segments[0].duration)}</div>
          </div>
          <div className="Ticket__col">
            <div className="Ticket__col-top">В ПУТИ</div>
            <div className="Ticket__col-bottom">{this.flightDuration(ticket.segments[0].date, ticket.segments[0].duration)}</div>
          </div>
          <div className="Ticket__col">
            <div className="Ticket__col-top">
            {this.transfersText(ticket.segments[0])}
          </div>
            <div className="Ticket__col-bottom">
              {ticket.segments[0].stops.map((stop, i) =>{
                return <span key={i}>{stop}, </span>
              })}
            </div>
          </div>
        </div>
        <div className="Ticket__row">
          <div className="Ticket__col">
            <div className="Ticket__col-top">
              {ticket.segments[1].origin} - {ticket.segments[1].destination}
            </div>
            <div className="Ticket__col-bottom">{this.flightTime(ticket.segments[1].date, ticket.segments[1].duration)}</div>
          </div>
          <div className="Ticket__col">
            <div className="Ticket__col-top">В ПУТИ</div>
            <div className="Ticket__col-bottom">{this.flightDuration(ticket.segments[1].date, ticket.segments[1].duration)}</div>
          </div>
          <div className="Ticket__col">
            <div className="Ticket__col-top">
              {this.transfersText(ticket.segments[1])}
            </div>
            <div className="Ticket__col-bottom">
              {ticket.segments[1].stops.map((stop, i) =>{
                return <span key={i}>{stop}, </span>
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Ticket;
