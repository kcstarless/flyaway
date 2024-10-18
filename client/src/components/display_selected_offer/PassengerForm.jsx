// PassengerForm.jsx
import {useForm} from "react-hook-form";
import { useCountries } from "../hooks/useCountries";
import Select from "react-select";
import { useLocalizationContext } from "../contexts/LocalizationContext";
import { useFlightOffersContext } from '../contexts/FlightOffersContext';
import React, { useEffect, useState } from "react";


const PassengerForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { countries } = useCountries();
    const { formData } = useFlightOffersContext();
    const { localizationData } = useLocalizationContext(); // Getting localization data
    const [selectedCountry, setSelectedCountry] = useState(null);

    // Set selected country when localizationData is available
    useEffect(() => {
        if (localizationData.countryCode) {
            const countryOption = countries.find(country => country.cca2.toLowerCase() === localizationData.countryCode.toLowerCase());
            if (countryOption) {
                const iddCode = countryOption.idd ? `${countryOption.idd.root}${countryOption.idd.suffixes[0]}` : "";
                setSelectedCountry({
                    value: iddCode,
                    label: (
                        <div className="country-option">
                            <img src={countryOption.flags.svg} alt="" style={{ width: "20px", marginRight: "10px" }} />
                            {/* {`${countryOption.cca2} (${iddCode})`} */}
                        </div>
                    ),
                });
            }
        }
    }, [localizationData, countries]);

    // Map countries for phone number
    const countryOptions = countries.map(country => {
        const iddCode = country.idd ? `${country.idd.root}${country.idd.suffixes[0]}` : ""; // Combine root and first suffix
        return {
            value: iddCode,
            label: (
                <div className="country-option">
                    <img src={country.flags.svg} alt="" style={{ width: "20px", marginRight: "10px" }} />
                    {`${country.name.common} (${iddCode})`}
                </div>
            ),
        };
    });

    // console.log(countries);
    const onSubmit = (data) => {
        console.log(data);
    }
    

    function createPassengerForm() {
        const passengers = formData.passengers;
        const formsPassengers = [];

        for (let index = 1; index <= passengers; index++) {
            formsPassengers.push(
                <div key={index}>
                <div className="form-title"><b>Passenger {index}</b></div>
                <fieldset className="passenger-form">
            {/* <legend>Required fields, please fill in as it appears on passport</legend> */}
                <div className="items">
                    <div className="item-title">First name {errors[`firstname${index}`] && <span className="validation">{errors[`firstname${index}`].message}</span>}</div>
                    <div className="item-input">
                        <input {...register(`firstname${index}`,{
                            required: " is required.",
                            validate: (value) => {
                                if(value.length < 2) {
                                    return "must be at least 2 characters."
                                }
                            }
                        }
                        )} type="text" placeholder="First name" />
                        
                    </div>
                </div>

                <div className="item">
                    <div className="item-title">Last name {errors.last_name && <span className="validation">{errors.last_name.message}</span>}</div>
                    <div className="item-input">
                        <input {...register("last_name", {
                            required: " is required.",
                            validate: (value) => {
                                if(value.length < 2) {
                                    return "must be at least 2 characters."
                                }
                            }
                        })} type="text" placeholder="Last name" />
                    </div>
                </div>
                
                <div className="item">
                    <div className="item-title">Gender {errors.gender && <span className="validation">{errors.gender.message}</span>}</div>
                    <div className="item-input">
                        <select {...register("gender", {
                            required: " is required."
                        })}>
                            <option value="" disabled selected></option>
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>
                </div>

                <div className="item">
                    <div className="item-title">Date of birth 
                    {(errors.dod_dd || errors.dod_mm || errors.dod_yyyy) && (
                        <span className="validation">
                            &nbsp; {errors.dod_dd?.message || errors.dod_mm?.message || errors.dod_yyyy?.message}
                        </span>
                    )}
                    </div>
                    <div className="item-input">
                        <div className="item-input-dob">
                        <input {...register("dod_dd", {
                            required: "date is required.",
                            validate: (value) => {
                                const day = parseInt(value);
                                if (day < 1 || day > 31) {
                                    return "Please enter a valid day";
                                }
                                return true;
                            }
                        })} type="text" placeholder="DD" />
                        <input {...register("dod_mm", {
                            required: "month is required",
                            validate: (value) => {
                                const day = parseInt(value);
                                if (day < 1 || day > 12) {
                                    return "Please enter a valid month";
                                }
                                return true;
                            }
                        })} type="text" placeholder="MM" />
                        <input {...register("dod_yyyy", {
                            required: "year is required",
                            validate: (value) => {
                                const year = parseInt(value);
                                if (year < 1900 || year > 2025) {
                                    return "Please enter a valid year";
                                }
                                return true;
                            }
                        })} type="text" placeholder="YYYY" />
                        </div>
                    </div>
                </div>

                <div className="item">
                    <div className="item-title">Email address {errors.email && <span className="validation">{errors.email.message}</span>}</div>
                    <div className="item-input">
                        <input {...register("email", {
                            required: " is required.",
                            validate: (value) => {
                                if(value.length < 2) {
                                    return "must be at least 2 characters."
                                }
                            }
                        })} type="text" placeholder="eg. tom@gmail.com" />
                    </div>
                </div>

                <div className="item">
                    <div className="item-title">Phone number {errors.country && <span className="validation">{errors.country.message}</span>}</div>
                    <div className="item-input">
                        <div className="item-input-phone"> 
                        <Select
                                options={countryOptions}
                                value={selectedCountry}
                                onChange={(selectedOption) => setSelectedCountry(selectedOption)}
                                placeholder="Code"
                                classNamePrefix="react-select"
                                isSearchable={false} 
                        />
                        <input {...register("phone", {
                            required: " is required.",
                            validate: (value) => {
                                if(value.length < 2) {
                                    return "must be at least 2 characters."
                                }
                            }
                        })} type="text" placeholder="Phone number" />
                        </div>
                    </div>
                </div>
                </fieldset>
                </div>
            )
        }
        return formsPassengers;
    }

    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
                {createPassengerForm()}
            <input type="submit"></input>
        </form>
    )
}

export default PassengerForm;