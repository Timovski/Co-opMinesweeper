using Npgsql;

namespace CoopMinesweeper.Services
{
    public interface IGameService
    {
        string CreateGame(string hostConnectionId);
        string GetHostConnectionId(string gameId);
        void RemoveOldGames();
    }

    public class GameService : IGameService
    {
        private const string ConnString = "Server=localhost;Port=5432;Database=CoopMinesweeper;User ID=postgres;Password=admin;";

        public string CreateGame(string hostConnectionId)
        {
            string gameId;
            using (var conn = new NpgsqlConnection(ConnString))
            {
                conn.Open();

                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = "CALL create_game(@p);";
                    cmd.Parameters.AddWithValue("p", hostConnectionId);
                    gameId = (string)cmd.ExecuteScalar();
                }
            }

            return gameId;
        }

        public string GetHostConnectionId(string gameId)
        {
            string hostConnectionId;
            using (var conn = new NpgsqlConnection(ConnString))
            {
                conn.Open();

                using (var cmd = new NpgsqlCommand("SELECT host_connection_id FROM public.games AS g WHERE g.game_id = @p;", conn))
                {
                    cmd.Parameters.AddWithValue("p", gameId);
                    hostConnectionId = (string)cmd.ExecuteScalar();
                }
            }

            return hostConnectionId;
        }

        public void RemoveOldGames()
        {
            try
            {
                using (var conn = new NpgsqlConnection(ConnString))
                {
                    conn.Open();

                    using (var cmd = new NpgsqlCommand("DELETE FROM public.games WHERE created_at < NOW() - interval '5' minute;", conn))
                    {
                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch
            {
                // ignored
            }
        }
    }
}
