import { useState } from "react";
import "./ConferenceEvent.css";
import TotalCost from "./TotalCost";
import { useSelector, useDispatch } from "react-redux";
import { incrementQuantity, decrementQuantity } from "./venueSlice";
import { decrementAvQuantity, incrementAvQuantity } from "./avSlice";
import { toggleMealSelection } from "./mealsSlice";

const ConferenceEvent = () => {
    const [showitems, setShowitems] = useState(false);
    const [numberOfPeople, setNumberOfPeople] = useState(1);
    const venueitems = useSelector((state) => state.venue);
    const avitems = useSelector((state) => state.av);
    const dispatch = useDispatch();
    const remainingAuditoriumQuantity = 3 - venueitems.find(item => item.name === "Auditorium Hall (Capacity:200)").quantity;
    const mealsitems = useSelector ((state) => state.meals)

    
    const handleToggleitems = () => {
        console.log("handleToggleitems called");
        setShowitems(!showitems);
    };

    const handleAddToCart = (index) => {
        if (venueitems[index].name === "Auditorium Hall (Capacity:200)" && venueitems[index].quantity >= 3) {
          return; 
        }
        dispatch(incrementQuantity(index));
      };
    
      const handleRemoveFromCart = (index) => {
        if (venueitems[index].quantity > 0) {
          dispatch(decrementQuantity(index));
        }
      };
    const handleincrementAvQuantity = (index) => {
      dispatch(incrementAvQuantity(index));
    };

    const handleDecrementAvQuantity = (index) => {
      dispatch(decrementAvQuantity(index));
    };

    const handleMealSelection = (index) => {
      const item = mealsitems[index];
      if (item.selected && item.type === "mealForPeople"){
        // Ensure numberOfPeople is set before toggling section
        const newNumberOfPeople = item.selected ? numberOfPeople : 0;
        dispatch(toggleMealSelection(index, newNumberOfPeople));
      }
      else{
        dispatch(toggleMealSelection(index));
      }
    };

    const getitemsFromTotalCost = () => {
        const items = [];
        venueitems.forEach((item) => {
          if (item.quantity > 0) {
            item.push({ ...item, type: "venue"});
          }
        });
        avitems.forEach((item) => {
          if (
            item.quantity > 0 && !items.some((i) => i.name === item.name && i.type === "av")
          ) {
            item.push({ ...item, type: "av"});
          }
        });
        mealsitems.forEach((item) => {
          if(item.selected) {
            const itemForDisplay = { ...item, type: "meals"};
            if (item.numberOfPeople) {
              itemForDisplay.numberOfPeople = numberOfPeople;
            }
            item.push(itemForDisplay);
          }
        });
        return items;
    };

    const items = getitemsFromTotalCost();

    const ItemsDisplay = ({ items }) => {
      console.log (items);
      return <>
        <div className="display_box1">
          {items.length === 0 && <p>No item selected</p>}
          <table className="table_item_data">
            <thead>
              <tr>
                <th>Name</th>
                <th>Unit Cost</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                    <td>{item.name}</td>
                    <td>${item.cost}</td>
                    <td> {item.type === "meals" || item.numberOfPeople ? ` For ${numberOfPeople} people` : item.quantity} </td>
                    <td> {item.type === "meals" || item.numberOfPeople ? `${item.cost * numberOfPeople}` : `${item.cost * item.quantity}`} </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </>
    };


    // Calculate the total cost of everything
    const calculateTotalCost = (section) => {
        let totalCost = 0;
        if (section === "venue") {
          venueitems.forEach((item) => {
            totalCost += item.cost * item.quantity;
          });
        } else if (section === "av"){
          avitems.forEach((item) => {
            totalCost += item.cost * item.quantity;
          });
        } else if(section === "meals"){
          mealsitems.forEach((item) => {
            if (item.selected) {
              totalCost += item.cost * numberOfPeople;
            }
          });
        }
        return totalCost;
      };
    

    const venueTotalCost = calculateTotalCost("venue");
    const avTotalCost = calculateTotalCost("av");
    const mealsTotalCost = calculateTotalCost("meals");


    const navigateToProducts = (idType) => {
        if (idType == '#venue' || idType == '#addons' || idType == '#meals') {
          if (showitems) { // Check if showitems is false
            setShowitems(!showitems); // Toggle showitems to true only if it's currently false
          }
        }
      }

      const totalCosts ={
        venue: venueTotalCost,
        av: avTotalCost,
        meals: mealsTotalCost,
    }

    return (
        <>
            <navbar className="navbar_event_conference">
                <div className="company_logo">Conference Expense Planner</div>
                <div className="left_navbar">
                    <div className="nav_links">
                        <a href="#venue" onClick={() => navigateToProducts("#venue")} >Venue</a>
                        <a href="#addons" onClick={() => navigateToProducts('#addons')}>Add-ons</a>
                        <a href="#meals" onClick={() => navigateToProducts('#meals')}>Meals</a>
                    </div>
                    <button className="details_button" onClick={() => setShowitems(!showitems)}>
                        Show Details
                    </button>
                </div>
            </navbar>
            <div className="main_container">
                {!showitems
                    ?
                    (
                        <div className="items-information">
                              <div id="venue" className="venue_container container_main">
        <div className="text">

          <h1>Venue Room Selection</h1>
        </div>
        <div className="venue_selection">
          {venueitems.map((item, index) => (
            <div className="venue_main" key={index}>
              <div className="img">
                <img src={item.img} alt={item.name} />
              </div>
              <div className="text">{item.name}</div>
              <div>${item.cost}</div>
      <div className="button_container">
        {venueitems[index].name === "Auditorium Hall (Capacity:200)" ? (

          <>
          <button
            className={venueitems[index].quantity === 0 ? "btn-warning btn-disabled" : "btn-minus btn-warning"}
            onClick={() => handleRemoveFromCart(index)}
          >
            &#8211;
          </button>
          <span className="selected_count">
            {venueitems[index].quantity > 0 ? ` ${venueitems[index].quantity}` : "0"}
          </span>
          <button
            className={remainingAuditoriumQuantity === 0? "btn-success btn-disabled" : "btn-success btn-plus"}
            onClick={() => handleAddToCart(index)}
          >
            &#43;
          </button>
        </>
        ) : (
          <div className="button_container">
            <button
              className={venueitems[index].quantity ===0 ? " btn-warning btn-disabled" : "btn-warning btn-plus"}
              onClick={() => handleRemoveFromCart(index)}
            >
              &#8211;
            </button>
            <span className="selected_count">
              {venueitems[index].quantity > 0 ? ` ${venueitems[index].quantity}` : "0"}
            </span>
            <button
              className={venueitems[index].quantity === 10 ? " btn-success btn-disabled" : "btn-success btn-plus"}
              onClick={() => handleAddToCart(index)}
            >
              &#43;
            </button>
            
            
          </div>
        )}
      </div>
            </div>
          ))}
        </div>
      
        <div className="total_cost">Total Cost: ${venueTotalCost}</div>
      </div>

                            {/*Necessary Add-ons*/}
                            <div id="addons" className="venue_container container_main">


                                <div className="text">

                                    <h1> Add-ons Selection</h1>

                                </div>
                                <div className="addons_selection">
                                  {avitems.map((item, index) => (
                                    <div className="av_data venue_main" key={index}>
                                      <div className="img">
                                        <img src={item.img} alt={item.name} />
                                </div>

                                <div className="text"> {item.name} </div>
                                  <div> ${item.cost} </div>
                                <div className="addons_btn">
                                  <button className="btn-warning" onClick={() => handleDecrementAvQuantity(index)}> &ndash; </button>
                                  <span className="quantity-value"> {item.quantity} </span>
                                  <button className="btn-success" onClick={() => handleincrementAvQuantity}> &#43; </button>
                                </div>
                            </div>
                          ))}
                                </div>
                                <div className="total_cost">Total Cost: {avTotalCost}</div>

                            </div>

                            {/* Meal Section */}

                            <div id="meals" className="venue_container container_main">

                                <div className="text">

                                    <h1>Meals Selection</h1>
                                </div>

                                <div className="input-container venue_selection">
                                  <label htmlFor="numberOfPeople"><h3>Number of People:</h3></label>
                                  <input type="number" className="input_box5" id="numberOfPeople" value={numberOfPeople}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value);

                                    if (isNaN(value) || value < 1){
                                      setNumberOfPeople(1);
                                    } else {
                                      setNumberOfPeople(value);
                                    }
                                  }}
                                    min="1"
                                  />
                                </div>
                                <div className="meal_selection">
                                  {mealsitems.map((item, index) => (
                                    <div className="meal_item" key={index} style={{ padding: 15 }}>
                                      <div className="inner">
                                        <input type="checkbox" id={`meal_${index}`} 
                                        checked={ item.selected }
                                        onChange={() => handleMealSelection(index)}
                                        />
                                        <label htmlFor={`meal_${index}`}> {item.name} </label>
                                      </div>
                                      <div className="meal_cost">${item.cost}</div>
                                    </div>
                                  ))}
                                </div>
                                <div className="total_cost">Total Cost: {mealsTotalCost}</div>


                            </div>
                        </div>
                    ) : (
                        <div className="total_amount_detail">
                            <TotalCost totalCosts={totalCosts} ItemsDisplay={() => <ItemsDisplay items={items} />} />
                        </div>
                    )
                }




            </div>
        </>

    );
};

export default ConferenceEvent;
