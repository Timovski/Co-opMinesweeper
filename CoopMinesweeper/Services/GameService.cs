using Npgsql;
using System;

namespace CoopMinesweeper.Services
{
    public interface IGameService
    {
        string CreateGame(string signal);
        string GetHostSignal(string gameId);
        void JoinGame(string clientSignal, string gameId);
        string CheckPeer(string gameId);
    }

    public class GameService : IGameService
    {
        public string CreateGame(string signal)
        {
            string newGameId;

            const string connString = "Server=localhost;Port=5432;Database=CoopMinesweeper;User ID=postgres;Password=admin;";

            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                // Insert some data
                //using (var cmd = new NpgsqlCommand())
                //{
                //    cmd.Connection = conn;
                //    cmd.CommandText = "INSERT INTO data (some_field) VALUES (@p)";
                //    cmd.Parameters.AddWithValue("p", "Hello world");
                //    cmd.ExecuteNonQuery();
                //}


                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = "CALL create_game(@p, '')";
                    cmd.Parameters.AddWithValue("p", signal);
                    newGameId = (string)cmd.ExecuteScalar();
                }






                // Retrieve all rows
                //using (var cmd = new NpgsqlCommand("SELECT * FROM public.games", conn))
                //using (var reader = cmd.ExecuteReader())
                //{
                //    while (reader.Read())
                //    {
                //        games.Add(new Game
                //        {
                //            Id = (long)reader[0],
                //            GameId = (string)reader[1],
                //            HostSignal = (string)reader[2],
                //            ClientSignal = (string)(reader.IsDBNull(3) ? null : reader[3]),
                //            CreatedAt = (DateTime)reader[4],
                //            ConnectedAt = (DateTime?)(reader.IsDBNull(5) ? null : reader[5])
                //        });
                //    }
                //}
            }

            return newGameId;
        }

        public string GetHostSignal(string gameId)
        {
            string hostSignal;
            const string connString = "Server=localhost;Port=5432;Database=CoopMinesweeper;User ID=postgres;Password=admin;";

            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                using (var cmd = new NpgsqlCommand("SELECT host_signal FROM public.games AS g WHERE g.game_id = @p", conn))
                {
                    cmd.Parameters.AddWithValue("p", gameId);
                    hostSignal = (string)cmd.ExecuteScalar();
                }
            }

            return hostSignal;
        }

        public void JoinGame(string clientSignal, string gameId)
        {
            const string connString = "Server=localhost;Port=5432;Database=CoopMinesweeper;User ID=postgres;Password=admin;";

            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                using (var cmd = new NpgsqlCommand("UPDATE public.games SET client_signal = @p, connected_at = @p2 WHERE game_id = @p3", conn))
                {
                    cmd.Parameters.AddWithValue("p", clientSignal);
                    cmd.Parameters.AddWithValue("p2", DateTime.Now);
                    cmd.Parameters.AddWithValue("p3", gameId);
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public string CheckPeer(string gameId)
        {
            string clientSignal;
            const string connString = "Server=localhost;Port=5432;Database=CoopMinesweeper;User ID=postgres;Password=admin;";

            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();

                using (var cmd = new NpgsqlCommand("SELECT client_signal FROM public.games AS g WHERE g.game_id = @p", conn))
                {
                    cmd.Parameters.AddWithValue("p", gameId);
                    clientSignal = (string)cmd.ExecuteScalar();
                }
            }

            return clientSignal;
        }
    }
}
