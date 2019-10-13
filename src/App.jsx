import React, {Component} from 'react';
import Ticket from './Ticket';
import InputGroup from './InputGroup';
import './App.scss';

class App extends Component{
  constructor(props){
    super(props)
    this.state={
      filters: {
        showAll: {
          text: 'Все',
          transfer: 'all',
          status: true,
          value: null
        },
        transfers: [
          {
            text: 'Без пересадок',
            transfer: 0,
            status: true,
            value: '0'
          },
          {
            text: '1 пересадка',
            transfer: 1,
            status: true,
            value: '1'
          },
          {
            text: '2 пересадки',
            transfer: 2,
            status: true,
            value: '2'
          },
          {
            text: '3 пересадки',
            transfer: 3,
            status: true,
            value: '3'
          },
        ]
      },
      subfilters: {
        cheapest: true,
        faster: false
      },
      tickets: [],
      ticketsSorted: []
    }
  }

  filterChange(event){
    const filters = this.state.filters.transfers;
    const filterTarget = event.target.getAttribute('index');
    let filterStatus;
    const filterObj = [];

    if(filterTarget === 'all' ){
      filterStatus = !this.state.filters.showAll.status;

      for(let i=0; i<filters.length; i++){
        filterObj.push(filters[i])
        filterObj[i].status = filterStatus;
      }

      this.setState({
        filters: {
          showAll: {
            text: 'Все',
            transfer: 'all',
            status: filterStatus,
            value: null
          },
          transfers: filterObj
        }
      })
    } else{
      filterStatus = (!filters[filterTarget].status) ? true : false;

      for(let i=0; i<filters.length; i++){
        if(filters[i].value === filterTarget){
          filterObj.push(filters[i]);
          filterObj[i].status = filterStatus;
        } else {
          filterObj.push(filters[i]);
        }
      }

      this.setState({
        filters: {
          showAll: {
            text: 'Все',
            transfer: 'all',
            status: this.state.filters.showAll.status,
            value: null
          },
          transfers: filterObj
        }
      })
    }

    this.sortTickets();
  }

  searchTickets = () => {
    fetch('https://front-test.beta.aviasales.ru/search', {
      method: 'GET'
    }).then(response => response.json()).then(json => {
      fetch('https://front-test.beta.aviasales.ru/tickets?searchId=' + json.searchId, {
        method: 'GET'
      }).then(response => response.json()).then(json => {
        this.setState({
          tickets: json.tickets
        })
        this.sortTickets();
      })
      return
    })
  }

  sortTickets(){
    let tickets = [];
    let sortParams = [];

    this.state.filters.transfers.map((filter, i) =>{
      if(filter.status && filter.value !== null){
        sortParams.push(filter.value)
      }
    })

    for(let i = 0; i < this.state.tickets.length; i++){
      for(let j = 0; j < sortParams.length; j++){
        if((this.state.tickets[i].segments[0].stops.length == sortParams[j] || this.state.tickets[i].segments[1].stops.length == sortParams[j]) &&
        (this.state.tickets[i].segments[0].stops.length <= sortParams[j] && this.state.tickets[i].segments[1].stops.length <= sortParams[j])){
          tickets.push(this.state.tickets[i])
        }
      }
    }

    if(!this.state.subfilters.cheapest){
      tickets.sort((a, b) => {
        const firstDuration = a.segments[0].duration + a.segments[1].duration;
        const secondDuration = b.segments[0].duration + b.segments[1].duration;
        if (firstDuration > secondDuration) return 1;
        if (firstDuration == secondDuration) return 0;
        if (firstDuration < secondDuration) return -1;
      })
    } else {
      tickets.sort((a, b) => {
        if (a.price > b.price) return 1;
        if (a.price == b.price) return 0;
        if (a.price < b.price) return -1;
      })
    }


    this.setState({
      ticketsSorted: tickets
    })
  }

  subfilter(event){
    let self = this.state
    if(event.target.classList.contains('active')){
      return false
    }

    this.setState({
      subfilters: {
        faster: !this.state.subfilters.faster,
        cheapest: !this.state.subfilters.cheapest,
      }
    })

    this.sortTickets();
  }

  componentDidMount(){
    this.searchTickets()
  }

  render(){
    const filters = this.state.filters.transfers

    return (
      <div className="App">
        <header className="App-header">

        </header>
        <section className="Main-content">
          <div className="Filter box">
            <h3 className="Filter__cap">Количество пересадок</h3>
            <div className="Filter__wrapper" onChange={(event) => this.filterChange(event)}>
              <InputGroup filter={this.state.filters.showAll} index={'all'} />
              {filters.map((filter, i) =>{
                return <InputGroup filter={filter} key={i} index={i} />
                })
              }
            </div>
          </div>
          <div className="Right-block">
            <div className="Subfilter">
              <button className={(this.state.subfilters.cheapest) ?
                'Subfilter__btn cheaper box active' :
                'Subfilter__btn cheaper box'}
                onClick={(event)=> this.subfilter(event)}>Самый дешевый</button>
              <button className={(this.state.subfilters.faster) ?
                'Subfilter__btn faster box active' :
                'Subfilter__btn faster box'}
                onClick={(event)=> this.subfilter(event)}>Самый быстрый</button>
            </div>
            <div className="Search-result">
              {this.state.ticketsSorted.map((ticket, i) =>{
                return <Ticket key={i} ticket={ticket} />
                })}
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default App;
