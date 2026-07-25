const pool = require('../config/db');

const registerForEvent = async (req,res,next)=>{
    try{
        const {event_id,name , email} = req.body;

        if(!event_id || !name || !email){
            return res.status(400).json({message:'event_id , name , email required'});
        }

        const [eventRows] = await pool.query('select * from events where id = ?',[event_id,name,email]);

        if(eventRows.length === 0){
            return res.status(404).json({ error: 'Event not found' });
        }

        const event = eventRows[0];

        const [countRows] = await pool.query('select count(*) as total_registered from registrations where event_id=?',[event_id]);

        if(countRows[0].total_registered >= event.total_seats){
              return res.status(400).json({ error: 'No seats left for this event' });
        }

        const [existing] = await pool.query(
        'SELECT * FROM registrations WHERE event_id = ? AND email = ?',
        [event_id, email]
        );


        if (existing.length > 0) {
        return res.status(400).json({ error: 'You are already registered for this event' });
        }

        const [result] = await pool.query(
      'INSERT INTO registrations (event_id, name, email) VALUES (?, ?, ?)',
      [event_id, name, email]
    );

    res.status(201).json({
      message: 'Registration successful',
      registration_id: result.insertId,
      event: event.title,
      name,
      email
    });

  } catch (error) {
    next(error);
  }

    
};

// get api
 const getMyRegistrations = async (req,res,next)=>{
  try{
    const {email} = req.params;

    const [rows] = await pool.query('select r.id as registration_id , r.name,r.registered_at,e.id as event_id,e.title,e.event_date,e.location from registrations r join events e on r.event_id = e.id where r.email = ?',[email]);
    res.status(200).json({count:rows.length,registrations:rows});
  }catch (error) {
    next(error);
  }
 };

 const cancelRegistration = async (req,res,next)=>{
  try{
    const {id} = req.params;

    const [existing] = await pool.query('select * from registrations where id = ?',[id]);
    if(existing.length === 0){
      return res.status(404).json({error:'registration not found'});

    }

    await pool.query('delete from registrations where id = ?',[id]);
    res.status(200).json({message:'registration cancelled successfully'});

  }catch (error) {
    next(error);
  }
 };

 module.exports = { registerForEvent, getMyRegistrations, cancelRegistration };