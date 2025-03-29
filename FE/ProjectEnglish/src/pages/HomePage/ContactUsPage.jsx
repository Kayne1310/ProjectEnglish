const ContactUs = () => {

    return (
        <section className="slider_section layout_padding long_section mb-5" style={{ backgroundColor: '#f9fafa' }} data-aos="fade-up">
            <div className="container">
                <div className="row align-items-center">
                    {/* <!-- Contact Form --> */}
                    <div className="col-md-12">
                        <div className="form_container">
                            <div className="heading_container text-center"data-aos="zoom-in">
                                <h2>Contact Us</h2>
                            </div>
                            <form action="">
                                <div className="form-group"data-aos="fade-left">
                                    <label htmlFor="name">Your Name</label>
                                    <input type="text" id="name" placeholder="Enter your full name" required />
                                </div>
                                <div className="form-group"data-aos="fade-right">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input type="tel" id="phone" placeholder="Enter your phone number" required />
                                </div>
                                <div className="form-group"data-aos="fade-left">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" placeholder="Enter your email address" required />
                                </div>
                                <div className="form-group"data-aos="fade-right">
                                    <label htmlFor="message">Message</label>
                                    <textarea id="message" className="message-box" placeholder="Write your message here..." required></textarea>
                                </div>
                                <div className="btn_box text-center"data-aos="fade-up">
                                    <button type="submit">SEND MESSAGE</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    {/* <!-- Map Section --> */}

                </div>
            </div>
        </section>
    )
}

export default ContactUs;