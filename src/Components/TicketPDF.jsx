import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 0,

    backgroundColor: '#f8f9fc',
  },
  // Main ticket container
  ticketContainer: {
    margin: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  // Colored top strip
  topStrip: {
    backgroundColor: '#1a237e',
    padding: '20 30',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIcon: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 22,
    fontWeight: 800,
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  ticketLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: '#ffab00',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  // Dashed border separator
  dashedBorder: {
    borderBottom: '2px dashed #e0e0e0',
    marginLeft: 30,
    marginRight: 30,
  },
  // Content sections
  contentSection: {
    padding: '20 30',
  },
  // Journey section
  journeySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeBlock: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 26,
    fontWeight: 800,
    color: '#1a1a2e',
  },
  timeLabel: {
    fontSize: 9,
    fontWeight: 600,
    color: '#6b7280',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  journeyLine: {
    flex: 1,
    marginLeft: 30,
    marginRight: 30,
    alignItems: 'center',
  },
  durationBadge: {
    backgroundColor: '#e8eaf6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 6,
  },
  durationText: {
    fontSize: 10,
    fontWeight: 700,
    color: '#1a237e',
  },
  journeyLineBar: {
    width: '100%',
    height: 3,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    position: 'relative',
  },
  journeyDotStart: {
    position: 'absolute',
    left: -5,
    top: -5,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#1a237e',
  },
  journeyDotEnd: {
    position: 'absolute',
    right: -5,
    top: -5,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#d32f2f',
  },
  // Info rows
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: 500,
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: 12,
    color: '#1a1a2e',
    fontWeight: 700,
  },
  // Seats section
  seatsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  seatChip: {
    backgroundColor: '#fff3e0',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#ffab00',
  },
  seatChipText: {
    fontSize: 9,
    fontWeight: 700,
    color: '#e65100',
  },
  // Price section
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  priceLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  priceValue: {
    fontSize: 11,
    fontWeight: 700,
    color: '#1a1a2e',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 2,
    borderTopColor: '#1a237e',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 800,
    color: '#1a1a2e',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 800,
    color: '#1a237e',
  },
  // Footer
  footer: {
    backgroundColor: '#f0f2f5',
    padding: '15 30',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#9e9e9e',
    lineHeight: 1.5,
  },
  barcodePlaceholder: {
    width: 100,
    height: 24,
    backgroundColor: '#1a1a2e',
    borderRadius: 2,
    marginTop: 4,
  },
  barcodeLines: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  barcodeBar: {
    width: 2,
    backgroundColor: '#ffffff',
    height: 20,
  },
  // Divider
  divider: {
    borderBottom: '1px solid #e8eaf0',
    marginTop: 8,
    marginBottom: 8,
  },
  // Section title
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#1a237e',
    marginBottom: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  // Badge
  statusBadge: {
    backgroundColor: '#e8f5e9',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    fontSize: 8,
    fontWeight: 700,
    color: '#2e7d32',
    letterSpacing: 1,
  },
  // Route highlight
  routeHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8eaf6',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 16,
  },
  routeCity: {
    fontSize: 16,
    fontWeight: 800,
    color: '#1a237e',
  },
  routeArrow: {
    fontSize: 16,
    color: '#1a237e',
    marginLeft: 12,
    marginRight: 12,
  },
  routeVia: {
    fontSize: 9,
    color: '#6b7280',
    fontWeight: 500,
    textAlign: 'center',
    marginBottom: 2,
  },
  // Tear-off section
  tearOff: {
    backgroundColor: '#f8f9fc',
    padding: '12 30',
    borderTop: '2px dashed #d0d0d0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tearOffText: {
    fontSize: 7,
    color: '#9e9e9e',
    letterSpacing: 0.5,
  },
  tearOffId: {
    fontSize: 8,
    fontWeight: 700,
    color: '#6b7280',
    fontFamily: 'Courier',
    letterSpacing: 1,
  },
  // Two column layout
  twoColumn: {
    flexDirection: 'row',
    gap: 20,
  },
  column: {
    flex: 1,
  },
});

// Helper to generate a simple barcode-like visual
const BarcodeBars = () => (
  <View style={styles.barcodeLines}>
    {[2, 4, 2, 6, 2, 3, 2, 5, 2, 4, 2, 6, 2, 3, 2, 5, 2, 4, 2, 3].map((height, i) => (
      <View key={i} style={{ width: 2, backgroundColor: '#ffffff', height: 8 + height * 2 }} />
    ))}
  </View>
);

const TicketPDF = ({ booking, userName }) => {
  const {
    _id,
    busName = 'Express Bus',
    busType = 'Standard',
    from = 'City A',
    to = 'City B',
    date = '',
    departureTime = '',
    arrivalTime = '',
    seats = [],
    totalFare = 0,
    status = 'confirmed',
    bookingDate = '',
  } = booking || {};

  const formatTime12 = (time) => {
    if (!time) return '--:--';
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  const formatDateLong = (dateStr) => {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateShort = (dateStr) => {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const bookingId = _id ? _id.slice(-8).toUpperCase() : 'N/A';
  const journeyDate = date || bookingDate || '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.ticketContainer}>
          {/* ===== TOP STRIP WITH BRANDING ===== */}
          <View style={styles.topStrip}>
            <View style={styles.brandSection}>
              <View style={styles.brandIcon}>
                <Text style={{ color: '#ffffff', fontSize: 18 }}>🚌</Text>
              </View>
              <Text style={styles.brandName}>BusTicket</Text>
            </View>
            <Text style={styles.ticketLabel}>E-Ticket</Text>
          </View>

          {/* ===== JOURNEY HIGHLIGHT ===== */}
          <View style={styles.contentSection}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{status.toUpperCase()}</Text>
            </View>

            <View style={{ marginTop: 12, marginBottom: 16 }}>
              <Text style={styles.routeVia}>Travel Journey</Text>
              <View style={styles.routeHighlight}>
                <Text style={styles.routeCity}>{from}</Text>
                <Text style={styles.routeArrow}>→</Text>
                <Text style={styles.routeCity}>{to}</Text>
              </View>
            </View>

            {/* ===== TIME SECTION ===== */}
            <View style={styles.journeySection}>
              <View style={styles.timeBlock}>
                <Text style={styles.timeText}>{formatTime12(departureTime)}</Text>
                <Text style={styles.timeLabel}>Departure</Text>
              </View>

              <View style={styles.journeyLine}>
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>
                    {busType === 'AC Sleeper' ? 'Sleeper' : busType === 'AC Seater' ? 'Seater' : 'Standard'}
                  </Text>
                </View>
                <View style={styles.journeyLineBar}>
                  <View style={styles.journeyDotStart} />
                  <View style={styles.journeyDotEnd} />
                </View>
              </View>

              <View style={styles.timeBlock}>
                <Text style={styles.timeText}>{formatTime12(arrivalTime)}</Text>
                <Text style={styles.timeLabel}>Arrival</Text>
              </View>
            </View>
          </View>

          <View style={styles.dashedBorder} />

          {/* ===== BOOKING DETAILS ===== */}
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Booking Details</Text>

            <View style={styles.twoColumn}>
              <View style={styles.column}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Bus Name</Text>
                  <Text style={styles.infoValue}>{busName}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Bus Type</Text>
                  <Text style={styles.infoValue}>{busType}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Travel Date</Text>
                  <Text style={styles.infoValue}>{formatDateShort(journeyDate)}</Text>
                </View>
              </View>
              <View style={styles.column}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Booking ID</Text>
                  <Text style={[styles.infoValue, { fontFamily: 'Courier', letterSpacing: 1 }]}>{bookingId}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Passenger</Text>
                  <Text style={styles.infoValue}>{userName || 'Traveler'}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Seats</Text>
                  <View style={styles.seatsSection}>
                    {seats.length > 0 ? (
                      seats.map((seat) => (
                        <View key={seat} style={styles.seatChip}>
                          <Text style={styles.seatChipText}>{seat}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.infoValue}>--</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.dashedBorder} />

          {/* ===== PRICE SUMMARY ===== */}
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Price Summary</Text>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Ticket Price (per seat)</Text>
              <Text style={styles.priceValue}>Rs. {(parseFloat(totalFare) / Math.max(seats.length, 1)).toFixed(0)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Number of Seats</Text>
              <Text style={styles.priceValue}>x {seats.length}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Booking Fee</Text>
              <Text style={styles.priceValue}>Free</Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>Rs. {parseFloat(totalFare).toFixed(0)}</Text>
            </View>
          </View>

          {/* ===== TEAR-OFF SECTION ===== */}
          <View style={styles.dashedBorder} />
          <View style={styles.tearOff}>
            <View>
              <Text style={styles.tearOffText}>Booking Reference</Text>
              <Text style={styles.tearOffId}>{bookingId}</Text>
            </View>
            <View>
              <Text style={styles.tearOffText}>Journey</Text>
              <Text style={styles.tearOffId}>{from?.slice(0, 4)}→{to?.slice(0, 4)}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 2 }}>
              <BarcodeBars />
            </View>
          </View>

          {/* ===== FOOTER ===== */}
          <View style={styles.footer}>
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>
                • Valid ID proof required at boarding • Report 30 mins before departure
              </Text>
            </View>
            <View style={{ marginTop: 4 }}>
              <Text style={styles.footerText}>
                {formatDateLong(journeyDate)} • {formatTime12(departureTime)} - {formatTime12(arrivalTime)} • {busName}
              </Text>
            </View>
            <View style={{ marginTop: 4 }}>
              <Text style={styles.footerText}>
                BusTicket.com • support@busticket.com • Terms & conditions apply
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TicketPDF;
