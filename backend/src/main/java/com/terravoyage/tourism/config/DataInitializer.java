package com.terravoyage.tourism.config;

import com.terravoyage.tourism.domain.*;
import com.terravoyage.tourism.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DestinationRepository destinationRepository;
    private final TourPackageRepository tourPackageRepository;
    private final CouponRepository couponRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           DestinationRepository destinationRepository,
                           TourPackageRepository tourPackageRepository,
                           CouponRepository couponRepository,
                           BookingRepository bookingRepository,
                           ReviewRepository reviewRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.destinationRepository = destinationRepository;
        this.tourPackageRepository = tourPackageRepository;
        this.couponRepository = couponRepository;
        this.bookingRepository = bookingRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Data already initialized
        }

        // 1. Seed Users
        User admin = new User(
                "Alexander Vance",
                "admin@terravoyage.com",
                passwordEncoder.encode("admin123"),
                "+1 (555) 234-5678",
                Role.ROLE_ADMIN,
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
        );
        userRepository.save(admin);

        User traveler = new User(
                "Gaurav Sharma",
                "traveler@terravoyage.com",
                passwordEncoder.encode("traveler123"),
                "+1 (555) 890-1234",
                Role.ROLE_CUSTOMER,
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
        );
        userRepository.save(traveler);

        User guide = new User(
                "Elena Rostova",
                "guide@terravoyage.com",
                passwordEncoder.encode("guide123"),
                "+41 22 555 4321",
                Role.ROLE_AGENT,
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
        );
        userRepository.save(guide);

        // 2. Seed Destinations
        Destination swiss = new Destination(
                "Swiss Alps & Zermatt",
                "Switzerland",
                "Central Europe",
                "Alpine & Crisp",
                "December - April (Skiing) / June - September (Hiking)",
                "Pristine snow-capped summits, panoramic cogwheel railways, crystal alpine lakes, and world-class luxury chalets at the foot of the iconic Matterhorn.",
                "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
                true
        );
        destinationRepository.save(swiss);

        Destination bali = new Destination(
                "Bali & Nusa Penida",
                "Indonesia",
                "Southeast Asia",
                "Tropical Maritime",
                "April - October (Dry Season)",
                "Lush emerald rice terraces, sacred sea temples, world-renowned surf breaks, and tranquil wellness sanctuaries surrounded by volcanic ridges.",
                "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
                true
        );
        destinationRepository.save(bali);

        Destination japan = new Destination(
                "Kyoto & Mount Fuji",
                "Japan",
                "East Asia",
                "Temperate Continental",
                "March - May (Cherry Blossoms) / October - November (Autumn Foliage)",
                "Centuries-old Zen gardens, ornate shinto shrines, tea ceremony heritage, bamboo groves, and views of majestic Mount Fuji reflected across Lake Kawaguchi.",
                "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
                true
        );
        destinationRepository.save(japan);

        Destination serengeti = new Destination(
                "Serengeti National Park",
                "Tanzania",
                "East Africa",
                "Savannah Warm",
                "July - October (Great Migration)",
                "Endless open savannahs hosting the greatest wildlife migration on Earth, luxury tented camps, and encounters with lion prides, leopards, and elephants.",
                "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
                true
        );
        destinationRepository.save(serengeti);

        Destination amalfi = new Destination(
                "Amalfi Coast & Positano",
                "Italy",
                "Southern Europe",
                "Mediterranean Warm",
                "May - September",
                "Dramatic pastel-colored cliffside villas cascading into the azure Tyrrhenian Sea, fragrant lemon groves, and private catamaran sunset sails.",
                "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
                true
        );
        destinationRepository.save(amalfi);

        Destination banff = new Destination(
                "Banff & Canadian Rockies",
                "Canada",
                "North America",
                "Subarctic Mountain",
                "June - September (Hiking & Canoeing)",
                "Turquoise glacial lakes like Lake Louise and Moraine Lake surrounded by towering jagged peaks, pine forests, and roaming grizzly bears.",
                "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=80",
                false
        );
        destinationRepository.save(banff);

        // 3. Seed Tour Packages
        TourPackage pkgSwiss = new TourPackage();
        pkgSwiss.setTitle("Glacier Peaks & Panoramic Express of Switzerland");
        pkgSwiss.setDestination(swiss);
        pkgSwiss.setCategory(TourCategory.LUXURY);
        pkgSwiss.setDurationDays(8);
        pkgSwiss.setDurationNights(7);
        pkgSwiss.setBasePrice(2850.0);
        pkgSwiss.setDiscountedPrice(2490.0);
        pkgSwiss.setDifficulty(Difficulty.EASY);
        pkgSwiss.setMaxGroupSize(14);
        pkgSwiss.setAvailableSlots(8);
        pkgSwiss.setRating(4.9);
        pkgSwiss.setReviewCount(48);
        pkgSwiss.setBannerImageUrl("https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80");
        pkgSwiss.setOverview("Embark on an unforgettable grand voyage through the Swiss Confederation. Ride the legendary Glacier Express with panoramic glass roofs, stay in 5-star alpine wellness resorts in Zermatt, and stand atop the Jungfraujoch 'Top of Europe' at 3,454 meters.");
        pkgSwiss.setHighlights(List.of("First-class Glacier Express scenic train journey", "Matterhorn glacier paradise cable car ride", "Private chocolate and artisanal cheese tastings", "Fondue dinner cruise on Lake Lucerne"));
        pkgSwiss.setInclusions(List.of("7 nights in handpicked 4/5-star boutique hotels", "All panoramic train and cogwheel rail passes", "Daily gourmet breakfast and 4 multi-course alpine dinners", "Certified Swiss mountain guide throughout"));
        pkgSwiss.setExclusions(List.of("International flights to Zurich/Geneva", "Personal travel insurance (optional add-on)", "Alcoholic beverages beyond tastings"));
        pkgSwiss.addItineraryDay(new ItineraryDay(1, "Arrival in Zurich & Lake Lucerne", "Arrive in Zurich and transfer by private express train to picturesque Lucerne. Evening welcome cocktail reception.", "Hotel Schweizerhof Lucerne", "Dinner"));
        pkgSwiss.addItineraryDay(new ItineraryDay(2, "Mount Pilatus Dragon Ride & Cogwheel Rail", "Ascend Mount Pilatus via the world's steepest cogwheel railway and return by aerial cableway.", "Hotel Schweizerhof Lucerne", "Breakfast, Lunch"));
        pkgSwiss.addItineraryDay(new ItineraryDay(3, "Glacier Express to Zermatt", "Board the iconic Glacier Express across 291 bridges and 91 tunnels into car-free Zermatt.", "Omnia Mountain Lodge Zermatt", "Breakfast, Dinner"));
        pkgSwiss.addItineraryDay(new ItineraryDay(4, "Matterhorn Viewpoint & Gornergrat Ridge", "Ride the historic Gornergrat railway facing 29 four-thousander peaks with reflections in Riffelsee.", "Omnia Mountain Lodge Zermatt", "Breakfast"));
        pkgSwiss.addItineraryDay(new ItineraryDay(5, "Jungfraujoch - Top of Europe", "Travel to Grindelwald and take the Eiger Express tricable gondola to Jungfraujoch.", "Romantik Hotel Beau Rivage Interlaken", "Breakfast, Dinner"));
        tourPackageRepository.save(pkgSwiss);

        TourPackage pkgBali = new TourPackage();
        pkgBali.setTitle("Mystical Bali: Ancient Water Temples & Nusa Penida");
        pkgBali.setDestination(bali);
        pkgBali.setCategory(TourCategory.BEACH_WELLNESS);
        pkgBali.setDurationDays(7);
        pkgBali.setDurationNights(6);
        pkgBali.setBasePrice(1450.0);
        pkgBali.setDiscountedPrice(1199.0);
        pkgBali.setDifficulty(Difficulty.MODERATE);
        pkgBali.setMaxGroupSize(16);
        pkgBali.setAvailableSlots(11);
        pkgBali.setRating(4.8);
        pkgBali.setReviewCount(62);
        pkgBali.setBannerImageUrl("https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80");
        pkgBali.setOverview("Discover the spiritual heartbeat of Bali. Unwind with daily oceanfront yoga in Ubud, trek through UNESCO Jatiluwih rice terraces, snorkel with giant manta rays at Nusa Penida's Kelingking T-Rex cliff, and witness the cliffside sunset Kecak dance at Uluwatu.");
        pkgBali.setHighlights(List.of("Speedboat expedition to Nusa Penida T-Rex cliff", "Sunrise trek to active Mount Batur caldera with volcanic breakfast", "Sacred Tirta Empul water purification ritual", "Private beachfront seafood dinner on Jimbaran Bay"));
        pkgBali.setInclusions(List.of("6 nights in luxury private pool villas and resort", "Private air-conditioned SUV with licensed Balinese driver", "Daily organic breakfast and all entry permits", "Traditional 90-minute Balinese spa treatment"));
        pkgBali.setExclusions(List.of("International flights to Denpasar", "Personal shopping & souvenirs", "Tipping for local porters"));
        pkgBali.addItineraryDay(new ItineraryDay(1, "Welcome to the Island of the Gods", "Arrival at Ngurah Rai airport. VIP flower garland greeting and transfer to Ubud rainforest villa.", "The Kayon Jungle Resort Ubud", "Dinner"));
        pkgBali.addItineraryDay(new ItineraryDay(2, "Sacred Monkey Forest & Tegallalang", "Explore the emerald canopy of Ubud and swing over the Tegallalang rice valley.", "The Kayon Jungle Resort Ubud", "Breakfast, Lunch"));
        pkgBali.addItineraryDay(new ItineraryDay(3, "Mount Batur Sunrise Summit", "Early morning gentle trek to Mount Batur summit to watch dawn break above the clouds.", "The Kayon Jungle Resort Ubud", "Breakfast, Spa"));
        pkgBali.addItineraryDay(new ItineraryDay(4, "Speedboat to Nusa Penida Island", "High-speed catamaran to Nusa Penida, visiting Kelingking Beach and Angel's Billabong.", "Semabu Hills Resort Penida", "Breakfast, Lunch"));
        tourPackageRepository.save(pkgBali);

        TourPackage pkgJapan = new TourPackage();
        pkgJapan.setTitle("Kyoto Sakura Odyssey & Mount Fuji Heritage");
        pkgJapan.setDestination(japan);
        pkgJapan.setCategory(TourCategory.CULTURAL);
        pkgJapan.setDurationDays(9);
        pkgJapan.setDurationNights(8);
        pkgJapan.setBasePrice(2590.0);
        pkgJapan.setDiscountedPrice(2250.0);
        pkgJapan.setDifficulty(Difficulty.EASY);
        pkgJapan.setMaxGroupSize(12);
        pkgJapan.setAvailableSlots(6);
        pkgJapan.setRating(4.95);
        pkgJapan.setReviewCount(84);
        pkgJapan.setBannerImageUrl("https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80");
        pkgJapan.setOverview("Step into a living masterpiece of traditional Japan. Walk thousands of vermilion torii gates at Fushimi Inari, experience private matcha tea ceremonies with master tea artisans, ride the Shinkansen Bullet Train at 300 km/h, and soak in natural onsens facing Mount Fuji.");
        pkgJapan.setHighlights(List.of("Authentic Ryokan stay with private Onsen hot springs", "Exclusive evening geisha district walking tour in Gion", "Shinkansen bullet train pass between Tokyo, Kyoto, and Hakone", "Kaiseki multi-course imperial banquet"));
        pkgJapan.setInclusions(List.of("8 nights accommodations including 2 nights luxury Ryokan", "Unlimited JR Japan Rail 7-Day Green Car pass", "All temple entrance tickets and private cultural guides", "Daily breakfast and 3 traditional Kaiseki dinners"));
        pkgJapan.setExclusions(List.of("International flights to Tokyo/Osaka", "Discretionary spending"));
        pkgJapan.addItineraryDay(new ItineraryDay(1, "Tokyo Metropolis to Hakone Fuji", "Board the Romancecar express to Hakone mountain district. Traditional Yukata fitting.", "Gora Kadan Ryokan Hakone", "Dinner"));
        pkgJapan.addItineraryDay(new ItineraryDay(2, "Lake Ashi Pirate Cruise & Mount Fuji Views", "Cruise serene Lake Ashi on a replica pirate ship and take the Hakone Ropeway over Owakudani.", "Gora Kadan Ryokan Hakone", "Breakfast, Dinner"));
        pkgJapan.addItineraryDay(new ItineraryDay(3, "Bullet Train to Ancient Kyoto", "Board the Shinkansen to Kyoto. Afternoon stroll along the Philosopher's Path.", "The Thousand Kyoto", "Breakfast"));
        pkgJapan.addItineraryDay(new ItineraryDay(4, "Fushimi Inari & Arashiyama Bamboo Forest", "Morning photography walk through 10,000 torii gates and the soaring green bamboo grove.", "The Thousand Kyoto", "Breakfast, Lunch"));
        tourPackageRepository.save(pkgJapan);

        TourPackage pkgSafari = new TourPackage();
        pkgSafari.setTitle("Serengeti Great Migration & Big Five Safari");
        pkgSafari.setDestination(serengeti);
        pkgSafari.setCategory(TourCategory.SAFARI);
        pkgSafari.setDurationDays(6);
        pkgSafari.setDurationNights(5);
        pkgSafari.setBasePrice(3400.0);
        pkgSafari.setDiscountedPrice(2990.0);
        pkgSafari.setDifficulty(Difficulty.MODERATE);
        pkgSafari.setMaxGroupSize(8);
        pkgSafari.setAvailableSlots(4);
        pkgSafari.setRating(5.0);
        pkgSafari.setReviewCount(36);
        pkgSafari.setBannerImageUrl("https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80");
        pkgSafari.setOverview("An extraordinary journey into the wild heart of Africa. Witness over two million wildebeest and zebras traverse crocodile-infested rivers, spot majestic lions stalking through golden savannahs, and sleep under millions of stars in ultra-luxury mobile tented camps.");
        pkgSafari.setHighlights(List.of("Sunrise hot-air balloon safari with champagne bush breakfast", "Descent into the volcanic Ngorongoro Crater amphitheater", "Private 4x4 pop-up roof safari vehicle with Swarovski binoculars", "Sundowner cocktails over the infinite plains"));
        pkgSafari.setInclusions(List.of("5 nights in luxury eco-safari lodges & glamping tents", "All national park conservation and ranger fees", "Full board meals (Breakfast, picnic safari lunch, 3-course dinner)", "Professional KPSGA Silver-certified safari guide"));
        pkgSafari.setExclusions(List.of("International flights to Kilimanjaro (JRO)", "Tanzania tourist visa", "Gratuities for safari guide"));
        pkgSafari.addItineraryDay(new ItineraryDay(1, "Arusha to Ngorongoro Conservation Area", "Land at Kilimanjaro airport and drive past coffee plantations into the Great Rift Valley highlands.", "Ngorongoro Crater Lodge", "Lunch, Dinner"));
        pkgSafari.addItineraryDay(new ItineraryDay(2, "Ngorongoro Crater Safari Expedition", "Descend 600 meters into the caldera floor to track black rhinos and giant tusker elephants.", "Ngorongoro Crater Lodge", "Breakfast, Lunch, Dinner"));
        pkgSafari.addItineraryDay(new ItineraryDay(3, "Central Serengeti & Seronera Valley", "Fly into central Serengeti for afternoon game drive tracking cheetahs on granite kopjes.", "Four Seasons Safari Lodge Serengeti", "Breakfast, Lunch, Dinner"));
        tourPackageRepository.save(pkgSafari);

        TourPackage pkgAmalfi = new TourPackage();
        pkgAmalfi.setTitle("Amalfi Cliffside Dream & Capri Private Catamaran");
        pkgAmalfi.setDestination(amalfi);
        pkgAmalfi.setCategory(TourCategory.LUXURY);
        pkgAmalfi.setDurationDays(6);
        pkgAmalfi.setDurationNights(5);
        pkgAmalfi.setBasePrice(2750.0);
        pkgAmalfi.setDiscountedPrice(2390.0);
        pkgAmalfi.setDifficulty(Difficulty.EASY);
        pkgAmalfi.setMaxGroupSize(10);
        pkgAmalfi.setAvailableSlots(7);
        pkgAmalfi.setRating(4.88);
        pkgAmalfi.setReviewCount(29);
        pkgAmalfi.setBannerImageUrl("https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80");
        pkgAmalfi.setOverview("Indulge in Italian elegance along the world's most glamorous coastline. Sleep in clifftop five-star villas in Positano, cruise into Capri's glowing Blue Grotto aboard a private catamaran, and savor Michelin-starred seafood with limoncello made from local Amalfi lemons.");
        pkgAmalfi.setHighlights(List.of("Private Riva boat day charter around Capri Island", "Walk along the breathtaking clifftop 'Path of the Gods'", "Hands-on authentic pizza and pasta masterclass in Ravello", "Sunset aperitivo overlooking Positano beach"));
        pkgAmalfi.setInclusions(List.of("5 nights in boutique clifftop sea-view suites", "Private luxury Mercedes van airport and coastal transfers", "Daily Mediterranean buffet breakfast and 2 fine-dining dinners", "Full day Capri yacht charter with skipper & Prosecco"));
        pkgAmalfi.setExclusions(List.of("Airfare to Naples International Airport", "City tourist taxes paid locally"));
        pkgAmalfi.addItineraryDay(new ItineraryDay(1, "Arrival in Naples & Drive to Positano", "Private chauffeur pickup in Naples. Scenic coastal drive to Positano. Prosecco check-in.", "Le Sirenuse Positano", "Dinner"));
        pkgAmalfi.addItineraryDay(new ItineraryDay(2, "Private Yacht Cruise to Isle of Capri", "Full day yacht cruise circling Faraglioni rocks and swimming in hidden sea caves.", "Le Sirenuse Positano", "Breakfast, Lunch"));
        pkgAmalfi.addItineraryDay(new ItineraryDay(3, "Ravello & Villa Cimbrone Gardens", "Visit the quiet hill town of Ravello and the 'Infinity Terrace' hanging above the sea.", "Belmond Hotel Caruso Ravello", "Breakfast, Dinner"));
        tourPackageRepository.save(pkgAmalfi);

        // 4. Seed Coupons
        Coupon c1 = new Coupon("EARLYBIRD15", 15.0, 400.0, 500.0, LocalDate.now().plusMonths(6), true);
        Coupon c2 = new Coupon("WANDER2026", 20.0, 600.0, 1000.0, LocalDate.now().plusMonths(12), true);
        Coupon c3 = new Coupon("GLOBETREK10", 10.0, 200.0, 200.0, LocalDate.now().plusMonths(3), true);
        couponRepository.saveAll(List.of(c1, c2, c3));

        // 5. Seed Reviews
        Review r1 = new Review(
                traveler,
                pkgSwiss,
                5,
                "Absolute fairy tale experience!",
                "The Glacier Express ride and Matterhorn sunrise took my breath away. Our guide Elena knew every mountain peak and secret cafe. Everything was seamless from arrival to checkout.",
                true
        );
        Review r2 = new Review(
                admin,
                pkgBali,
                5,
                "Incredible culture and breathtaking villas",
                "The private pool villa in Ubud was heaven on earth. Watching dawn break over Mount Batur after a gentle hike was magical. Highly recommended for couples!",
                true
        );
        Review r3 = new Review(
                traveler,
                pkgSafari,
                5,
                "Once in a lifetime wildlife adventure",
                "We saw all Big Five in the first two days! The hot air balloon flight over the Serengeti with champagne at dawn is something I will never forget.",
                true
        );
        reviewRepository.saveAll(List.of(r1, r2, r3));

        // 6. Seed Sample Bookings
        Booking b1 = new Booking();
        b1.setBookingReference("TV-2026-X89J");
        b1.setUser(traveler);
        b1.setTourPackage(pkgSwiss);
        b1.setTravelDate(LocalDate.now().plusMonths(2));
        b1.setAdultCount(2);
        b1.setChildCount(0);
        b1.setBaseAmount(4980.0);
        b1.setDiscountAmount(400.0);
        b1.setAddOnAmount(60.0);
        b1.setTotalAmount(4640.0);
        b1.setStatus(BookingStatus.CONFIRMED);
        b1.setCouponCode("EARLYBIRD15");
        b1.setSpecialRequests("Window seats requested on Glacier Express train");
        b1.setCreatedAt(LocalDateTime.now().minusDays(5));
        bookingRepository.save(b1);

        Booking b2 = new Booking();
        b2.setBookingReference("TV-2026-M42K");
        b2.setUser(traveler);
        b2.setTourPackage(pkgBali);
        b2.setTravelDate(LocalDate.now().plusMonths(4));
        b2.setAdultCount(1);
        b2.setChildCount(0);
        b2.setBaseAmount(1199.0);
        b2.setDiscountAmount(119.9);
        b2.setAddOnAmount(35.0);
        b2.setTotalAmount(1114.1);
        b2.setStatus(BookingStatus.CONFIRMED);
        b2.setCouponCode("GLOBETREK10");
        b2.setSpecialRequests("Vegetarian breakfast options preferred");
        b2.setCreatedAt(LocalDateTime.now().minusDays(1));
        bookingRepository.save(b2);
    }
}
