const pool = require('../config/db');;

const getAllEvents = async (req,res,next)=>{
    try{
        const [events] = await pool.query('select * from events order by event_date asc');
        res.status(200).json({count:events.length,events});
    }catch(error){
        next(error);
    }
};

const getEventById = async (req,res,next)=>{
    try{
        const {id} = req.params;

        const [rows] = await pool.query('select * from events where id = ?',[id]);

        if(rows.length === 0){
            return res.status(404).json({message:'event not found'});
        }

        const [registrationCount] = await pool.query('select count(*) as total_registered from registrations where event_id = ?',[id]);

        res.status(200).json({
            event:rows[0],
            total_registered:registrationCount[0].total_registered,
            seats_left: rows[0].total_seats - registrationCount[0].total_registered
        });
    }catch (error) {
         next(error);
      }
};

module.exports = {getAllEvents,getEventById};