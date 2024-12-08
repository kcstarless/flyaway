// PassengerForm.jsx
import { set, useForm } from "react-hook-form";
import { useCountries } from "../hooks/useCountries";
import Select from "react-select";
import { useContextLocalization } from "../contexts/ContextLocalization";
import { useContextFlightOffers } from '../contexts/ContextFlightOffers';
import { useContextFlightBooking } from "../contexts/ContextFlightBooking";
import { useEffect, useState } from "react";
import { getSessionstorageItem, setSessionstorageItem } from "../helpers/localstorage";
import { fetchCreateFlightBooking } from '../apicalls/fetchConfirmBooking';
import { useNavigate } from "react-router-dom";
import { LoaderPlane } from '../helpers/Loader';
import { useContextUserSession } from "../contexts/ContextUserSession";

const PassengerForm = () => {
    const { accessToken } = useContextUserSession();
    const { countries } = useCountries();
    const { formData } = useContextFlightOffers();
    const { localizationData } = useContextLocalization(); // Getting localization data
    const { setTravelerInfo, pricingOutbound, pricingReturn, setBookedOutbound, setBookedReturn, bookedOutbound, bookedReturn } = useContextFlightBooking();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [selectedCountryPhone, setSelectedCountryPhone] = useState(null);
    const [selectedCountryPassports, setSelectedCountryPassports] = useState([]);

    const passengers = formData.current.passengers;
    const formsPassengers = [];
    
    // Set selected country when localizationData is available for phone number and country of issuance
    useEffect(() => {
        if (localizationData.countryCode) {
            const countryOption = countries.find(country => country.cca2.toLowerCase() === localizationData.countryCode.toLowerCase());
            if (countryOption) {
                const iddCode = countryOption.idd ? `${countryOption.idd.root}${countryOption.idd.suffixes[0]}` : "";
                setSelectedCountryPhone({
                    value: iddCode,
                    label: (
                        <div className="country-option">
                            {`${iddCode}`}
                        </div>
                    ),
                });
                const defaultPassportCountry = {
                    value: countryOption.cca2,
                    label: (
                        <div className="country-option">
                            <img src={countryOption.flags.svg} alt="" style={{ width: "20px", marginRight: "10px" }} />
                            {`${countryOption.name.common} (${countryOption.cca2})`}
                        </div>
                    )
                };

                // Set default passport countries for each passenger
                const defaultCountries = Array.from({ length: passengers }, () => defaultPassportCountry);
                setSelectedCountryPassports(defaultCountries);
            }
        }
    }, [localizationData, countries]);

    // Map countries for phone field with value as iddCode eg. +61
    const countryPhone = countries.map(country => {
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

    // Map countries for issuance field with value as cca2 eg. AU
    const countryPassport = countries.map(country => {
        return {
            value: country.cca2,
            label: (
                <div className="country-option">
                    <img src={country.flags.svg} alt="" style={{ width: "20px", marginRight: "10px" }} />
                    {`${country.name.common} (${country.cca2})`}
                </div>
            ),
        };
    });
   
    // Select country phone code only display the dial code
    const selectedCountryPhoneHandler = (value) => {
        console.log(value);
        setSelectedCountryPhone({
            value: value,
            label: (
                <div className="country-option">
                    {value}
                </div>
            )
        });
    }

    // Create a custom filter for the Select component
    const customFilter = (option, inputValue) => {
        const countryName = option.label.props.children[1]; // Extract the country name from the label
        const cca2Code = option.value; // Get the cca2 code
    
        // Check if either the country name or cca2 code includes the input value
        return (
            countryName.toLowerCase().includes(inputValue.toLowerCase()) ||
            cca2Code.toLowerCase().includes(inputValue.toLowerCase())
        );
    };
    // Create number of passenger form. 
    // Registered value is array followed by name. Eg traveler[1].fristname
    const createPassengersForm = () => {
        for (let index = 0; index < passengers; index++) {
            formsPassengers.push(
                <div key={index}>

                {/* Contact Details is printed only once */}
                {index === 0 && (
                <fieldset className="passenger-form">

                <legend className="form-title"><b>Booking contact details</b></legend>
                    <div className="item">
                            <div className="item-title">Email address {errors.emailAddress && <span className="validation">{errors.emailAddress.message}</span>}</div>
                            <div className="item-input">
                                <input {...register(`emailAddress`, {
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
                        <div className="item-title">Phone number 
                            {errors.number && 
                                <span className="validation">{errors.number.message}</span>}
                        </div>
                        <div className="item-input">
                            <div className="item-input-select"> 
                            <Select
                                    options={countryPhone}
                                    value={selectedCountryPhone}
                                    onChange={(selectedOption) => selectedCountryPhoneHandler(selectedOption.value)}
                                    placeholder=""
                                    className="select-phone"
                                    classNamePrefix="react-select"
                            />
                            <input {...register(`number`, {
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
                )}

                {/* Number of forms based on passenger numbers */}
                <fieldset className="passenger-form">
                <legend className="form-title"><b>Passenger {index + 1}</b></legend>
                
                <input {...register(`travelers[${index}].id`)} type="hidden" value={index + 1} />

                <div className="items">
                    <div className="item-title">First name {errors?.travelers?.[index]?.name?.firstName && <span className="validation">{errors.travelers[index].name.firstName.message}</span>}</div>
                    <div className="item-input">
                        <input {...register(`travelers[${index}].name.firstName`,{
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
                    <div className="item-title">Last name {errors?.travelers?.[index]?.name?.lastName && <span className="validation">{errors.travelers[index].name.lastName.message}</span>}</div>
                    <div className="item-input">
                        <input {...register(`travelers[${index}].name.lastName`, {
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
                    <div className="item-title">Gender {errors?.travelers?.[index]?.gender && <span className="validation">{errors.travelers[index].gender.message}</span>}</div>
                    <div className="item-input">
                        <select {...register(`travelers[${index}].gender`, {
                            required: " is required."
                        })}>
                            <option>Female</option>
                            <option>Male</option>
                        </select>
                    </div>
                </div>

                <div className="item">
                    <div className="item-title">Date of birth 
                    {(errors?.travelers?.[index]?.dd || errors?.travelers?.[index]?.mm || errors?.travelers?.[index]?.yyyy) && (
                        <span className="validation">
                            &nbsp; {errors.travelers[index].dd?.message || errors.travelers[index].mm?.message || errors.travelers[index].yyyy?.message}
                        </span>
                    )}
                    </div>
                    <div className="item-input">
                        <div className="item-input-dob">
                        <input {...register(`travelers[${index}].dd`, {
                            required: "date is required.",
                            validate: (value) => {
                                const day = parseInt(value);
                                if (day < 1 || day > 31) {
                                    return "Please enter a valid day";
                                }
                                return true;
                            }
                        })} type="text" placeholder="DD" />
                        <input {...register(`travelers[${index}].mm`, {
                            required: "month is required",
                            validate: (value) => {
                                const day = parseInt(value);
                                if (day < 1 || day > 12) {
                                    return "Please enter a valid month";
                                }
                                return true;
                            }
                        })} type="text" placeholder="MM" />
                        <input {...register(`travelers[${index}].yyyy`, {
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
                {/* <div className="form-title">Travel Document</div> */}
                <div className="item">
                    <div className="item-title">Passport No {errors?.travelers?.[index]?.passportNo && <span className="validation">{errors.travelers[index].passportNo.message}</span>}</div>
                    <div className="item-input">
                        <input {...register(`travelers[${index}].passportNo`, {
                            required: " is required.",
                            validate: (value) => {
                                if(value.length < 2) {
                                    return "must be at least 2 characters."
                                }
                            }
                        })} type="text" placeholder="Passport No." />
                    </div>
                </div>

                <div className="item">
                    <div className="item-title">Country of issuance {errors?.travelers?.[index]?.issuance && <span className="validation">{errors.travelers[index].issuance.message}</span>}</div>
                    <div className="item-input">
                        <div className="item-input-select"> 
                        <Select
                                options={countryPassport}
                                value={selectedCountryPassports[index]}
                                onChange={(selectedOption) => {
                                    const newSelectedCountryPassports = [...selectedCountryPassports];
                                    newSelectedCountryPassports[index] = selectedOption; // Update specific index
                                    setSelectedCountryPassports(newSelectedCountryPassports);
                                }}
                                placeholder="Select Country"
                                classNamePrefix="react-select"
                                className="select-country"
                                filterOption={customFilter} 
                        />
                        </div>
                    </div>
                </div>

                </fieldset>
                </div>
            )
        }
        return formsPassengers;
    }
    
    const prepTravelers = (data) => {
        const updateDob = data.travelers.map((traveler, index) => {
            const {dd, mm, yyyy, passportNo } = traveler // Extract dd, mm, yyyy
            const fullDob = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
            const callingCode = selectedCountryPhone.value.replace('+', ''); // Remove +sign
            const issuanceCountry = selectedCountryPassports[index].value;
            const phoneNumber = data.number;
            const email = data.emailAddress;

            return {
                id: traveler.id,
                gender: traveler.gender.toUpperCase(),
                name: { firstName: traveler.name.firstName, lastName: traveler.name.lastName },
                documents: [{documentType: "PASSPORT", issuanceCountry: issuanceCountry, nationality: issuanceCountry, number: passportNo, expiryDate: "2025-12-12", holder: true }], 
                contact: {phones: [{countryCallingCode: callingCode, number: phoneNumber, deviceType: "MOBILE"}],
                            emailAddress: email},
                dateOfBirth: fullDob,
            };
        });
        return updateDob;
    }

    // On submit prepare the data for submission
    const onSubmit = async (data) => {
        try {
            setTravelerInfo(prepTravelers(data));
            setSessionstorageItem("travelerInfo", prepTravelers(data));
            setLoading(true);
            if (pricingOutbound) {
                const response = await fetchCreateFlightBooking(pricingOutbound.data.flightOffers[0], getSessionstorageItem('travelerInfo'), accessToken);
                if (response) {
                    setBookedOutbound(response);
                    setSessionstorageItem('bookedOutbound', response);
                    console.log("Booking Outbound: ", response);
                }
            }
            if (pricingReturn) {
                const response = await fetchCreateFlightBooking(pricingReturn.data.flightOffers[0], getSessionstorageItem('travelerInfo'), accessToken);
                setBookedReturn(response);
                setSessionstorageItem('bookedReturn', response);
                console.log("Booking Return: ", response);
            }
            // Navigate only after the booking confirmation is successful
            // console.log("bookedOutbound", bookedOutbound);
            setLoading(false);
            if (bookedOutbound || bookedReturn) {
                navigate("/checkout");
            }
        } catch (err) {
            alert("Flight couldn't be confirmed.");
            console.log("Error confirming booking:", err);
            navigate("/");
            // Optionally, show an error message to the user
        }
    };

    return (
        <>
        {(!pricingOutbound) && (<><LoaderPlane messageTop="Locking in the price." messageBottom="Please wait..." /><div className="dialog-backdrop-loading"></div></>)}
        {(loading) && (<><LoaderPlane messageTop="Confirming booking details." messageBottom="Please wait..." /><div className="dialog-backdrop-loading"></div></>)}
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-title"></div>
            {createPassengersForm()}
            <button type="submit" className="btn btn--tertiary">{loading ? "Processing..." : "Book Flight"}</button>
        </form>
        </>
    )
}

export default PassengerForm;