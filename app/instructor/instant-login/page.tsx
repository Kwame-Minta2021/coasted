export default function InstantLogin() {
  return (
    <div>
      <h1>Instructor Login</h1>
      <form action="/api/instructor/simple-auth" method="POST">
        <input type="email" name="email" value="instructor@coastedcode.com" readOnly />
        <input type="password" name="password" value="instructor123" readOnly />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
